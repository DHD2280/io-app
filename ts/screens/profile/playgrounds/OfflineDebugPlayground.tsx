import { ScrollView, View } from "react-native";
import {
  ContentWrapper,
  Divider,
  IOStyles,
  LabelMini,
  ListItemHeader,
  ListItemSwitch,
  VSpacer
} from "@pagopa/io-app-design-system";
import { useCallback } from "react";
import { DebugConnectionButton } from "../../../components/debug/DebugConnectionButton";
import { useIODispatch, useIOSelector } from "../../../store/hooks";
import { setIsDebugConnection } from "../../../features/connectivityDebug/store/actions";
import { isActiveDebugConnectionSelector } from "../../../features/connectivityDebug/store/selectors";
import { useHeaderSecondLevel } from "../../../hooks/useHeaderSecondLevel";
import IOMarkdown from "../../../components/IOMarkdown";

export const OfflineDebugPlayground = () => {
  const dispatch = useIODispatch();
  const isActiveDebugConnection = useIOSelector(
    isActiveDebugConnectionSelector
  );
  const onOfflineTestToggle = useCallback(
    (enabled: boolean) => {
      dispatch(setIsDebugConnection(enabled));
    },
    [dispatch]
  );
  useHeaderSecondLevel({
    title: "Offline test - Playground"
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[IOStyles.horizontalContentPadding, { flex: 1, flexGrow: 1 }]}
      >
        <ListItemHeader label="Offline test" />
        <IOMarkdown content="In questa sezione viene data la possibilità agli sviluppatori che sono in ambiente di dev (non prod) di simulare la perdita di connessione e il ritorno online. " />
        <ListItemSwitch
          label={"Offline test"}
          description={
            "Qui per selezionare se l'ambiente di test deve supportare i test offline"
          }
          value={isActiveDebugConnection}
          onSwitchValueChange={onOfflineTestToggle}
        />
        <Divider />
        <VSpacer />
        <DebugConnectionButton />
      </ScrollView>
    </View>
  );
};
