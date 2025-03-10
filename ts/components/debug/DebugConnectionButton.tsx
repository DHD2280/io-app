import {
  ButtonOutline,
  ButtonSolid,
  VSpacer
} from "@pagopa/io-app-design-system";
import { useCallback } from "react";
import {
  isActiveDebugConnectionSelector,
  isDebugConnectedSelector
} from "../../features/connectivityDebug/store/selectors";
import { useIODispatch, useIOSelector } from "../../store/hooks";
import { isLocalEnv } from "../../utils/environment";
import {
  setDebugConnectionStatus,
  setIsDebugConnection
} from "../../features/connectivityDebug/store/actions";

export const DebugConnectionButton = () => {
  const dispatch = useIODispatch();
  const isActiveDebugConnection = useIOSelector(
    isActiveDebugConnectionSelector
  );
  const isDebugConnected = useIOSelector(isDebugConnectedSelector);
  const showButton = isActiveDebugConnection && isLocalEnv;

  const buttonSolidText = isDebugConnected
    ? "Disabilita Connessione"
    : "Abilita Connessione";

  const buttonOutlineText = isActiveDebugConnection
    ? "Usa la connessione del device"
    : "Usa la connessione di debug";

  const changeConnctivityValue = useCallback(() => {
    dispatch(setDebugConnectionStatus(!isDebugConnected));
  }, [dispatch, isDebugConnected]);

  const changeConnection = useCallback(() => {
    dispatch(setIsDebugConnection(!isActiveDebugConnection));
  }, [dispatch, isActiveDebugConnection]);

  if (showButton) {
    return (
      <>
        <ButtonSolid
          label={buttonSolidText}
          accessibilityLabel={buttonSolidText}
          onPress={changeConnctivityValue}
        />
        <VSpacer />
        <ButtonOutline
          label={buttonOutlineText}
          accessibilityLabel={buttonOutlineText}
          onPress={changeConnection}
        />
      </>
    );
  }
  return <></>;
};
