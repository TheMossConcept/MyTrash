import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { List } from "react-native-paper";
import PlasticCollectionDetails, {
  PlasticCollection,
  PlasticCollectionDetailsProps,
} from "./collections/PlasticCollectionDetails";

type Props = {
  showSections: Array<PlasticCollection["collectionStatus"]>;
  collections: PlasticCollection[];
} & Pick<PlasticCollectionDetailsProps, "interactable">;

const PlasticCollectionList: FC<Props> = ({
  showSections,
  collections,
  interactable,
}) => {
  // TODO: Should this logic reside in the backend instead, or is it view related? Perhaps
  // a gateway would be the appropriate place to put this. For now, move it to a utility function

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
