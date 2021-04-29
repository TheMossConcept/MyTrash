import React, { FC } from "react";
import { Text, View } from "react-native";
import { List } from "react-native-paper";
// import { DateTime } from "luxon";

type PlasticCollectionDetailProps = { plasticCollection: PlasticCollection };

// TODO: This should come autogenerated from the backend!
export type PlasticCollection = {
  id: string;
  requesterId: string;
  recipientPartnerId: string;
  numberOfUnits: number;
  streetName: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  companyName?: string;
  collectionStatus: "pending" | "scheduled" | "delivered" | "received";
};

const PlasticCollectionDetail: FC<PlasticCollectionDetailProps> = ({
  plasticCollection,
  children,
}) => {
  const {
    companyName,
    streetName,
    streetNumber,
    zipCode,
    city,
    numberOfUnits,
  } = plasticCollection;

  const title = companyName || `${streetName} ${streetNumber}`;

  return (
    <List.Accordion title={title}>
      {companyName && <Text>{companyName}</Text>}
      <Text>
        {streetName} {streetNumber}
      </Text>
      <Text>
        {city} {zipCode}
      </Text>
      <Text>Antal enheder {numberOfUnits}</Text>
      {children}
      {/* TODO: Make a button to register schedule pick-up and another to register delivery */}
    </List.Accordion>
  );
};

type Props = {
  plasticCollections: PlasticCollection[];
  title: string;
  children?: (collectionId: string) => React.ReactNode;
};

const PlasticCollectionsDetails: FC<Props> = ({
  plasticCollections,
  title,
  children,
}) => {
  return (
    <List.Section>
      <List.Subheader>{title}</List.Subheader>
      {plasticCollections.map((collection) => (
        <View key={collection.id}>
          <PlasticCollectionDetail plasticCollection={collection}>
            {children && children(collection.id)}
          </PlasticCollectionDetail>
        </View>
      ))}
    </List.Section>
  );
};

export default PlasticCollectionsDetails;
