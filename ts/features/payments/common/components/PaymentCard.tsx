import {
  BodySmall,
  H6,
  IOColors,
  IOSkeleton,
  Tag,
  VStack,
  WithTestID
} from "@pagopa/io-app-design-system";
import { format } from "date-fns";
import { capitalize } from "lodash";
import { StyleSheet, View } from "react-native";
import BPayLogo from "../../../../../img/wallet/payment-methods/bpay_logo_full.svg";
import PayPalLogo from "../../../../../img/wallet/payment-methods/paypal/paypal_logo_ext.svg";
import { LogoPaymentWithFallback } from "../../../../components/ui/utils/components/LogoPaymentWithFallback";
import I18n from "../../../../i18n";

export type PaymentCardProps = {
  brand?: string;
  hpan?: string;
  expireDate?: Date;
  holderName?: string;
  holderPhone?: string;
  holderEmail?: string;
  isExpired?: boolean;
};

const SECONDARY_INFO_TEXT_COLOR: IOColors = "grey-700";

export type PaymentCardComponentProps = WithTestID<
  | ({
      isLoading?: false;
    } & PaymentCardProps)
  | {
      isLoading: true;
    }
>;

const PaymentCard = (props: PaymentCardComponentProps) => {
  if (props.isLoading) {
    return <PaymentCardSkeleton />;
  }

  const cardIcon = props.brand && (
    <LogoPaymentWithFallback brand={props.brand} isExtended />
  );

  const holderNameText = props.holderName && (
    <BodySmall
      color={SECONDARY_INFO_TEXT_COLOR}
      weight="Semibold"
      accessibilityLabel={I18n.t("wallet.methodDetails.a11y.bpay.owner", {
        fullOwnerName: props.holderName
      })}
    >
      {props.holderName}
    </BodySmall>
  );

  const expireDateText = props.expireDate && (
    <BodySmall weight="Semibold" color={SECONDARY_INFO_TEXT_COLOR}>
      {I18n.t("wallet.creditCard.validUntil", {
        expDate: format(props.expireDate, "MM/YY")
      })}
    </BodySmall>
  );

  const maskedEmailText = props.holderEmail && (
    <BodySmall
      color={SECONDARY_INFO_TEXT_COLOR}
      weight="Semibold"
      accessibilityLabel={I18n.t("wallet.methodDetails.a11y.paypal.owner", {
        email: props.holderEmail
      })}
    >
      {props.holderEmail}
    </BodySmall>
  );

  const maskedPhoneText = props.holderPhone && (
    <BodySmall
      color={SECONDARY_INFO_TEXT_COLOR}
      weight="Semibold"
      accessibilityLabel={I18n.t("wallet.methodDetails.a11y.bpay.phone", {
        // we do this to make the screen reader read the number digit by digit,
        phoneNumber: props.holderPhone.split("").join(" ")
      })}
    >
      {props.holderPhone}
    </BodySmall>
  );

  const renderBankLogo = () => {
    if (props.holderEmail) {
      return (
        <View accessibilityLabel="PayPal">
          <PayPalLogo
            testID="paymentCardPayPalLogoTestId"
            height={48}
            width={113}
          />
        </View>
      );
    }

    if (props.holderPhone) {
      return (
        <BPayLogo
          testID="paymentCardBPayLogoTestId"
          accessible={true}
          accessibilityLabel="BANCOMAT Pay"
          height={48}
          width={136}
        />
      );
    }

    if (props.hpan) {
      const circuitName =
        props.brand || I18n.t("wallet.methodDetails.cardGeneric");

      return (
        <H6
          color="black"
          accessibilityLabel={I18n.t("wallet.methodDetails.a11y.credit.hpan", {
            circuit: circuitName,
            // we space the hpan to make the screen reader read it digit by digit
            spacedHpan: props.hpan.split("").join(" ")
          })}
          numberOfLines={1}
          ellipsizeMode="middle"
          style={{ flexShrink: 1 }}
        >
          {capitalize(circuitName)} •••• {props.hpan}
        </H6>
      );
    }

    return undefined;
  };

  const expiredTag = (
    <View testID={`${props.testID}-expired`}>
      <Tag
        forceLightMode
        variant="error"
        text={I18n.t("features.payments.methods.status.expired")}
      />
    </View>
  );

  return (
    <View style={[styles.card, props.isExpired && styles.expiredCard]}>
      <View style={styles.wrapper}>
        <View style={styles.paymentInfo}>
          {renderBankLogo()}
          {props.isExpired ? expiredTag : cardIcon}
        </View>
        <View style={styles.additionalInfo}>
          {holderNameText}
          {maskedEmailText}
          {maskedPhoneText}
          {expireDateText}
        </View>
      </View>
    </View>
  );
};

const PaymentCardSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.wrapper}>
      <View style={styles.paymentInfo}>
        <IOSkeleton
          color={IOColors["grey-200"]}
          shape="rectangle"
          width={"60%"}
          height={24}
          radius={28}
        />
        <IOSkeleton
          color={IOColors["grey-200"]}
          shape="rectangle"
          width={"20%"}
          height={24}
          radius={28}
        />
      </View>
      <VStack space={8}>
        <IOSkeleton
          color={IOColors["grey-200"]}
          shape="rectangle"
          width={"55%"}
          height={16}
          radius={28}
        />
        <IOSkeleton
          color={IOColors["grey-200"]}
          shape="rectangle"
          width={"45%"}
          height={16}
          radius={28}
        />
      </VStack>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingTop: 8,
    aspectRatio: 16 / 10,
    backgroundColor: IOColors["grey-100"],
    borderRadius: 8,
    borderWidth: 1,
    borderCurve: "continuous",
    borderColor: IOColors["grey-200"]
  },
  expiredCard: {
    borderColor: IOColors["error-600"],
    borderLeftWidth: 9,
    paddingLeft: 7
  },
  wrapper: {
    flex: 1,
    justifyContent: "space-between"
  },
  paymentInfo: {
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  additionalInfo: {
    justifyContent: "space-between"
  }
});

export { PaymentCard };
