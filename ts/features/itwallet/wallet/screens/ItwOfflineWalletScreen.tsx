import { HeaderFirstLevel } from "@pagopa/io-app-design-system";
import { IOScrollView } from "../../../../components/ui/IOScrollView";
import I18n from "../../../../i18n";
import { ItwWalletCardsContainer } from "../../../wallet/components/WalletCardsContainer";
import { withOfflineAlert } from "../utils/withOfflineAlert";
import { DebugConnectionButton } from "../../../../components/debug/DebugConnectionButton";

const ItwOfflineWalletScreen = () => (
  <>
    <HeaderFirstLevel
      title={I18n.t("wallet.wallet")}
      ignoreSafeAreaMargin={true}
      actions={[]}
    />
    <IOScrollView excludeSafeAreaMargins={true}>
      <ItwWalletCardsContainer />
      <DebugConnectionButton />
    </IOScrollView>
  </>
);

const ItwOfflineWalletScreenWithAlert = withOfflineAlert(
  ItwOfflineWalletScreen
);

export { ItwOfflineWalletScreenWithAlert as ItwOfflineWalletScreen };
