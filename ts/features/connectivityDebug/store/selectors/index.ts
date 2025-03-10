import { GlobalState } from "../../../../store/reducers/types";

export const isDebugConnectedSelector = (state: GlobalState) =>
  state.features.connectivityDebug.isConnected;

export const isActiveDebugConnectionSelector = (state: GlobalState) =>
  state.features.connectivityDebug.isActive;

export const connectivityDebugSelector = (state: GlobalState) =>
  state.features.connectivityDebug;
