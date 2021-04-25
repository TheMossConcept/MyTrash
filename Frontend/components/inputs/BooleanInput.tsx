import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, Text } from "react-native-paper";

type Props = {
  booleanState: [boolean, (newValue: boolean) => void];
  label: string;
};

const BooleanInput: FC<Props> = ({ booleanState, label }) => {
  const [booleanValue, setBooleanValue] = booleanState;

  const toggleBooleanValue = () => setBooleanValue(!booleanValue);

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label}</Text>
      <Checkbox
        status={booleanValue ? "checked" : "unchecked"}
        onPress={toggleBooleanValue}
        uncheckedColor="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  labelText: {
    color: "black",
  },
});

export default BooleanInput;
