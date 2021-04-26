import * as React from "react";
import { Button, StyleSheet } from "react-native";
import AutocompleteInput from "../components/inputs/AutocompleteInput";
import BooleanInput from "../components/inputs/BooleanInput";
import NumericInput from "../components/inputs/NumericInput";
import StringInput from "../components/inputs/StringInput";

import { Text, View } from "../components/Themed";

export default function RecipientScreen() {
  return <></>;
  // Iterer igennem en afhentning
  /* RecipientPartner.aggregator */
  /* RecipientPartner.processor. Consider whether the requiresConfirmation can 
          be omitted if the aggregator and processor is the same or it is better to 
          have two separate roles */
  /*
  return (
    <View style={styles.container}>
      <BooleanInput label="Bekræft modtagelse af plast poser" />
      <Text>Register aggregeret plast</Text>
      <AutocompleteInput endpoint="GetClusters/" />
      <NumericInput label="Vægt" />
      {requiresConfirmation && (
        <BooleanInput label="Bekræft modtagelse af aggregeret plast" />
      )}
      <Text>Register batch</Text>
      <NumericInput label="Vægt" />
      <StringInput label="Eget batchnummer" />
      <Button title="Opret batch" />
    </View>
  );
   */
}

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
