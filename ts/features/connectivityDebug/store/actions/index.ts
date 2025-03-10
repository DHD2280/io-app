import { ActionType, createStandardAction } from "typesafe-actions";

export const setDebugConnectionStatus = createStandardAction(
  "SET_DEBUG_CONNECTION_STATUS"
)<boolean>();

export const setIsDebugConnection = createStandardAction(
  "SET_IS_DEBUG_CONNECTION"
)<boolean>();

export type ConnectivityDebugActions =
  | ActionType<typeof setDebugConnectionStatus>
  | ActionType<typeof setIsDebugConnection>;
