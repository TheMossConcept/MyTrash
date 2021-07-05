import React, { FC } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ViewProps,
} from "react-native";

type CollectionStatus = "pending" | "scheduled" | "delivered" | "received";

// TODO: This becomes unnecessary when we introduce end-to-end typings
export type CollectionStatusData = {
  numberOfUnits: number;
  createdAt: Date;
  scheduledPickupDate?: Date;
  collectionStatus: CollectionStatus;
};

type Props = {
  dismissPopover: () => void;
  data: CollectionStatusData;
} & ViewProps;

const CollectionStatusPopover: FC<Props> = ({
  dismissPopover,
  style,
  data,
  ...viewProps
}) => {
  return (
    <View style={[styles.container, style]} {...viewProps}>
      <View style={styles.crossContainer}>
        <TouchableOpacity onPress={dismissPopover}>
          <Image
            source={require("../../assets/icons/cross.png")}
            style={{ width: 17, height: 17 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headlineContainer}>
        <Text style={styles.headline}>Status på afhentninger.</Text>
      </View>
      <StatusLine collectionStatus="pending" data={data} />
      <StatusLine collectionStatus="scheduled" data={data} />
      <StatusLine collectionStatus="delivered" data={data} />
      <StatusLine collectionStatus="received" data={data} />
    </View>
  );
};

type StatusLineProps = {
  data: CollectionStatusData;
  collectionStatus: CollectionStatus;
} & ViewProps;

const StatusLine: FC<StatusLineProps> = ({
  data,
  collectionStatus,
  style,
  ...viewProps
}) => {
  const isCurrentStatus = data.collectionStatus === collectionStatus;
  let statusText = "";

  switch (collectionStatus) {
    case "pending":
      statusText = "Afventer.";
      break;
    case "scheduled":
      statusText = `Afhentning \nplanlagt.`;
      break;
    case "delivered":
      statusText = `Afhentning \nbekræftet.`;
      break;
    case "received":
      statusText = "Modtaget.";
      break;
    default:
      statusText = "";
  }

  return (
    <View style={[styles.statusLineContainer, style]} {...viewProps}>
      <View style={styles.statusIndicatorContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: isCurrentStatus ? "#748c43" : "#e7e7e8" },
          ]}
        />
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
      <View style={styles.statusInformationContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 458,
    width: 400,
    backgroundColor: "#d2d3c8",
  },
  crossContainer: {
    alignItems: "flex-end",
    padding: 24,
  },
  headlineContainer: {
    marginLeft: 20,
    marginBottom: 40.5,
  },
  statusLineContainer: {
    marginHorizontal: 38.5,
    marginBottom: 20,
    flexDirection: "row",
  },
  statusInformationContainer: {
    flex: 1,
  },
  statusIndicatorContainer: {
    flex: 2,
    alignItems: "center",
    flexDirection: "row",
    borderRightWidth: 2,
    borderRightColor: "#b4b7af",
    borderStyle: "solid",
  },
  statusIndicator: {
    height: 50,
    width: 50,
    borderRadius: 20,
    marginRight: 17,
  },
  statusText: {
    color: "#898c8e",
    fontFamily: "HelveticaNeueLTPro-Bd",
    fontSize: 16,
  },
  headline: {
    fontFamily: "HelveticaNeueLTPro-Hv",
    fontSize: 30,
    color: "#898c8e",
  },
});

export default CollectionStatusPopover;
