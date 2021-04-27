import React, { FC } from "react";
import { Text } from "react-native";
import { List } from "react-native-paper";

type Props = { plasticCollection: PlasticCollection; interactable: boolean };
export type PlasticCollectionDetailsProps = Props;

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
};

const PlasticCollectionDetails: FC<Props> = ({ plasticCollection }) => {
  const {
    companyName,
    streetName,
    streetNumber,
    zipCode,
    city,
    numberOfUnits,
    /*
    requesterId,
    recipientPartnerId,
     */
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
      <Text>Antal enheder ${numberOfUnits}</Text>
      {/* TODO: Make a button to register schedule pick-up and another to register delivery */}
    </List.Accordion>
  );
};

export default PlasticCollectionDetails;
