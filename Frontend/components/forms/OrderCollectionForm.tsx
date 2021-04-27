import React, { FC } from "react";
// TODO: Fix it so that we use buttons from react-native-paper instead
import { View, ViewProps } from "react-native";
import { setValue } from "../../utils/form";
import NumericInput from "../inputs/NumericInput";
import StringInput from "../inputs/StringInput";

// TODO: Everything should not always be optional!
export type CollectionFormData = {
  numberOfUnits?: number;
  comment?: string;
};

type Props = {
  collectionFormState: [
    CollectionFormData,
    (newValue: CollectionFormData) => void
  ];
} & ViewProps;

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const CollectionForm: FC<Props> = ({ collectionFormState, ...viewProps }) => {
  const [collectionFormData] = collectionFormState;

  const { numberOfUnits, comment } = collectionFormData;

  const setCollectionFormValue = setValue(collectionFormState);

  // TODO_SESSION: Get cluster id from the cluster context and collectorId
  // from the logged in user and do the actual POST request here
  // TODO: Disable the spreading is forbidden style and spread the view props here!
  return (
    <View style={viewProps.style}>
      <NumericInput
        label="Antal enheder"
        numberState={[numberOfUnits, setCollectionFormValue("numberOfUnits")]}
      />
      <StringInput
        label="Kommentar"
        stringState={[comment, setCollectionFormValue("comment")]}
      />
    </View>
  );
};

export default CollectionForm;
