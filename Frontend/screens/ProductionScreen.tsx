import * as React from "react";
import { Button, StyleSheet } from "react-native";
import StringInput from "../components/inputs/StringInput";

import { Text, View } from "../components/Themed";

export default function ProductionScreen() {
  return <></>;
  /* Vis for hvert batch vi har modtaget */
  /*
  return (
    <View style={styles.container}>
      <Boolean label="Bekræft modtagelse af batch" />
      <StringInput label="Varenummer" />
      <Button title="Opret vare" />

      // Iterer 
      <Button title="Afsend varer"_ />
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
