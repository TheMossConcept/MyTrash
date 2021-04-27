import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { List } from "react-native-paper";
import PlasticCollectionDetails, {
  PlasticCollection,
  PlasticCollectionDetailsProps,
} from "./PlasticCollection";

type Props = {
  showSections: CollectionStatusTypes[];
  collections: CollectionWithStatusType[];
} & Pick<PlasticCollectionDetailsProps, "interactable">;

export type CollectionWithStatusType = PlasticCollection & {
  collectionStatus: CollectionStatusTypes;
};

export type CollectionStatusTypes =
  | "pending"
  | "scheduled"
  | "delivered"
  | "received";

const PlasticCollectionList: FC<Props> = ({
  showSections,
  collections,
  interactable,
}) => {
  // TODO: Should this logic reside in the backend instead, or is it view related? Perhaps
  // a gateway would be the appropriate place to put this!
  const sortedCollections = collections.reduce<{
    pending: PlasticCollection[];
    scheduled: PlasticCollection[];
    delivered: PlasticCollection[];
    received: PlasticCollection[];
  }>(
    (accumulator, collection) => {
      const { collectionStatus, ...collectionWithoutStatus } = collection;
      switch (collectionStatus) {
        case "pending":
          return {
            ...accumulator,
            pending: [...accumulator.pending, collectionWithoutStatus],
          };
        case "scheduled":
          return {
            ...accumulator,
            scheduled: [...accumulator.scheduled, collectionWithoutStatus],
          };
        case "delivered":
          return {
            ...accumulator,
            delivered: [...accumulator.delivered, collectionWithoutStatus],
          };
        case "received":
          return {
            ...accumulator,
            received: [...accumulator.received, collectionWithoutStatus],
          };
        default:
          // eslint-disable-next-line no-console
          console.warn("Default case in PlasticCollectionList!!");
          return accumulator;
      }
    },
    { pending: [], scheduled: [], delivered: [], received: [] }
  );

  const showPending = showSections.includes("pending");
  const showScheduled = showSections.includes("scheduled");
  const showDelivered = showSections.includes("delivered");
  const showReceived = showSections.includes("received");

  return (
    <View style={styles.container}>
      {showPending && (
        <List.Section>
          <List.Subheader>Afventer</List.Subheader>
          {sortedCollections.pending.map((pendingCollection) => (
            <PlasticCollectionDetails
              key={pendingCollection.id}
              plasticCollection={pendingCollection}
              interactable={interactable}
            />
          ))}
        </List.Section>
      )}
      {showScheduled && (
        <List.Section>
          <List.Subheader>Planlagt</List.Subheader>
          {sortedCollections.scheduled.map((scheduledCollection) => (
            <PlasticCollectionDetails
              key={scheduledCollection.id}
              plasticCollection={scheduledCollection}
              interactable={interactable}
            />
          ))}
        </List.Section>
      )}
      {showDelivered && (
        <List.Section>
          <List.Subheader>Afleveret</List.Subheader>
          {sortedCollections.delivered.map((deliveredCollection) => (
            <PlasticCollectionDetails
              key={deliveredCollection.id}
              plasticCollection={deliveredCollection}
              interactable={interactable}
            />
          ))}
        </List.Section>
      )}
      {showReceived && (
        <List.Section>
          <List.Subheader>Bekræftet</List.Subheader>
          {sortedCollections.received.map((receivedCollection) => (
            <PlasticCollectionDetails
              key={receivedCollection.id}
              plasticCollection={receivedCollection}
              interactable={interactable}
            />
          ))}
        </List.Section>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
});

export default PlasticCollectionList;
