import * as E from "fp-ts/lib/Either";
import { call, fork, put, select, take } from "typed-redux-saga/macro";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import { REHYDRATE } from "redux-persist";
import { configureNetInfo, fetchNetInfoState } from "../utils";
import { startTimer } from "../../../utils/timer";
import { setConnectionStatus } from "../store/actions";
import { ReduxSagaEffect, SagaCallReturnType } from "../../../types/utils";
import { isConnectedSelector } from "../store/selectors";
import {
  connectivityDebugSelector,
  isActiveDebugConnectionSelector,
  isDebugConnectedSelector
} from "../../connectivityDebug/store/selectors";

const CONNECTIVITY_STATUS_LOAD_INTERVAL = (60 * 1000) as Millisecond;
const CONNECTIVITY_STATUS_FAILURE_INTERVAL = (10 * 1000) as Millisecond;

/**
 * this saga requests and checks the connection status
 */
export function* connectionStatusSaga(): Generator<
  ReduxSagaEffect,
  boolean,
  SagaCallReturnType<typeof fetchNetInfoState>
> {
  try {
    const isActiveDebugConnection = yield* select(
      isActiveDebugConnectionSelector
    );
    const response = yield* call(fetchNetInfoState());
    if (E.isRight(response) && !isActiveDebugConnection) {
      yield* put(setConnectionStatus(response.right.isConnected === true));
      return true;
    }
    if (isActiveDebugConnection) {
      const isDebugConnected = yield* select(isDebugConnectedSelector);
      yield* put(setConnectionStatus(isDebugConnected));
      return isDebugConnected;
    }
    return false;
  } catch (e) {
    // do nothing. it should be a library error
    return false;
  }
}

/**
 * this saga requests and checks in loop connection status
 * if the connection is off app could show a warning message or avoid
 * the whole usage.
 */
export function* connectionStatusWatcherLoop() {
  // check connectivity status periodically
  while (true) {
    const response: SagaCallReturnType<typeof connectionStatusSaga> =
      yield* call(connectionStatusSaga);

    // if we have no connection increase rate
    if (response === false) {
      yield* call(startTimer, CONNECTIVITY_STATUS_FAILURE_INTERVAL);
      continue;
    }

    const isAppConnected = yield* select(isConnectedSelector);

    // if connection is off increase rate
    if (!isAppConnected) {
      yield* call(startTimer, CONNECTIVITY_STATUS_FAILURE_INTERVAL);
    } else {
      yield* call(startTimer, CONNECTIVITY_STATUS_LOAD_INTERVAL);
    }
  }
}

export default function* root(): IterableIterator<ReduxSagaEffect> {
  // configure net info library to check status and fetch a specific url
  while (true) {
    const connectivityDebug = yield* select(connectivityDebugSelector);
    // eslint-disable-next-line no-underscore-dangle
    if (connectivityDebug?._persist.rehydrated) {
      break; // Exit the loop if Redux Persist has finished
    }
    yield* take(REHYDRATE); // Keep listening to the event
  }

  configureNetInfo();
  yield* fork(connectionStatusWatcherLoop);
}
