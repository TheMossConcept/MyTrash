import React, { FC } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import globalStyles from "../../utils/globalStyles";

type Props = { value: string } & TextInputProps;

const InformationField: FC<Props> = ({ value, style, ...textInputProps }) => {
  return (
    <TextInput
      value={value}
      style={[globalStyles.textField, styles.informationTextField, style]}
      editable={false}
      {...textInputProps}
    />
  );
};

const styles = StyleSheet.create({
  informationTextField: {
    height: 55,
    color: "#898c8e",
    backgroundColor: "#ebecee",
  },
});

export default InformationField;
