import { DateTime } from "luxon";
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
  createdAt: string;
  scheduledPickupDate?: string;
  deliveryDate?: string;
  receivedDate?: string;
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
        <Text style={styles.headline}>Status på afhentning.</Text>
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

  let dateToDisplay: DateTime | undefined;
  let statusText = "";

  switch (collectionStatus) {
    case "pending":
      statusText = "Afventer.";
      dateToDisplay = DateTime.fromISO(data.createdAt);
      break;
    case "scheduled":
      statusText = `Afhentning \nplanlagt.`;
      dateToDisplay = data.scheduledPickupDate
        ? DateTime.fromISO(data.scheduledPickupDate)
        : undefined;
      break;
    case "delivered":
      statusText = `Afhentning \nbekræftet.`;
      dateToDisplay = data.deliveryDate
        ? DateTime.fromISO(data.deliveryDate)
        : undefined;
      break;
    case "received":
      statusText = "Modtaget.";
      dateToDisplay = data.receivedDate
        ? DateTime.fromISO(data.receivedDate)
        : undefined;
      break;
    default:
      statusText = "";
  }

  const dateString = `${dateToDisplay?.toFormat("dd LLLL")}`;
  const timeString =
    dateToDisplay && (dateToDisplay?.minute !== 0 || dateToDisplay?.hour !== 0)
      ? ` ${dateToDisplay.toFormat("HH:mm")}`
      : "";

  const dateTimeString = `${dateString}${timeString}`;

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
      <View style={styles.statusInformationContainer}>
        {isCurrentStatus && (
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.informationText}>
              {`${data.numberOfUnits} Stk.`}
            </Text>
            {dateToDisplay && (
              <Text style={styles.informationText}>{dateTimeString}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 430,
    width: 380,
    backgroundColor: "#d2d3c8",
  },
  crossContainer: {
    alignItems: "flex-end",
    padding: 24,
  },
  headlineContainer: {
    marginLeft: 20,
    marginBottom: 20.25,
  },
  statusLineContainer: {
    marginHorizontal: 38.5,
    marginBottom: 10,
    flexDirection: "row",
  },
  statusInformationContainer: {
    flex: 1,
    paddingLeft: 18,
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
  informationText: {
    color: "#898c8e",
    fontSize: 16.5,
    fontFamily: "HelveticaNeueLTPro-Md",
    marginBottom: 5,
  },
  headline: {
    fontFamily: "HelveticaNeueLTPro-Hv",
    fontSize: 30,
    color: "#898c8e",
  },
});

export default CollectionStatusPopover;
