import { HeaderFirstLevel } from "@pagopa/io-app-design-system";
import * as React from "react";
import { useLayoutEffect } from "react";
import { IOScrollView } from "../../../../components/ui/IOScrollView";
import I18n from "../../../../i18n";
import { useIONavigation } from "../../../../navigation/params/AppParamsList";
import { ItwWalletCardsContainer } from "../../../wallet/components/WalletCardsContainer";

const ItwWalletScreen = () => {
  const navigation = useIONavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderFirstLevel title={I18n.t("wallet.wallet")} type="base" />
      )
    });
  }, [navigation]);

  return (
    <IOScrollView excludeSafeAreaMargins={true}>
      <ItwWalletCardsContainer />
    </IOScrollView>
  );
};

export { ItwWalletScreen };
