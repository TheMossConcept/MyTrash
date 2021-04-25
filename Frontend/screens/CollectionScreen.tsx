import React, { FC, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import CollectionForm, {
  CollectionFormData,
} from "../components/forms/OrderCollectionForm";

const CollectionScreen: FC = () => {
  const collectionFormDataState = useState<CollectionFormData>({});
  return (
    <View style={styles.container}>
      <Text>Bestil afhentning</Text>
      <CollectionForm collectionFormState={collectionFormDataState} />
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
