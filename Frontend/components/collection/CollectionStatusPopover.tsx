import React, { FC } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";

// TODO: This becomes unnecessary when we introduce end-to-end typings
export type CollectionStatusData = {
  numberOfUnits: number;
  createdAt: Date;
  scheduledPickupDate?: Date;
  collectionStatus: "pending" | "scheduled" | "delivered" | "received";
};

type Props = { dismissPopover: () => void; data: CollectionStatusData };

const CollectionStatusPopover: FC<Props> = ({ dismissPopover }) => {
  return (
    <View style={styles.container}>
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
  },
  headline: {
    fontFamily: "HelveticaNeueLTPro-Hv",
    fontSize: 30,
    color: "#898c8e",
  },
});

export default CollectionStatusPopover;
