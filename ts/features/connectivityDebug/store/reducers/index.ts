import { getType } from "typesafe-actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createMigrate,
  MigrationManifest,
  PersistConfig,
  PersistedState,
  persistReducer
} from "redux-persist";
import { Action } from "../../../../store/actions/types";
import { setDebugConnectionStatus, setIsDebugConnection } from "../actions";

// Define the type for the connection state
export type ConnectivityDebugState = {
  isActive: boolean;
  isConnected: boolean;
};

// Define the initial state
const initialState: ConnectivityDebugState = {
  isActive: false,
  isConnected: true
};

// Define the reducer
const connectivityDebugStateReducer = (
  state: ConnectivityDebugState = initialState,
  action: Action
): ConnectivityDebugState => {
  switch (action.type) {
    case getType(setIsDebugConnection):
      return {
        ...state,
        isActive: action.payload
      };
    case getType(setDebugConnectionStatus):
      return {
        ...state,
        isConnected: action.payload
      };
    default:
      return state;
  }
};

const CURRENT_REDUX_CONNECTIVITY_STORE_VERSION = 0;

const migrations: MigrationManifest = {
  "0": (state: PersistedState) => ({
    ...state,
    isActive: false,
    isConnected: true
  })
};

const persistConfig: PersistConfig = {
  key: "connectivity",
  storage: AsyncStorage,
  migrate: createMigrate(migrations, { debug: false }),
  version: CURRENT_REDUX_CONNECTIVITY_STORE_VERSION,
  whitelist: ["isActive", "isConnected"]
  // it is also useful to persist isConnected to simulate
  // the flow of opening the app without a connection
};

export const connectivityDebugPersistor = persistReducer<
  ConnectivityDebugState,
  Action
>(persistConfig, connectivityDebugStateReducer);
