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
      multiline
      {...textInputProps}
    />
  );
};

const styles = StyleSheet.create({
  informationTextField: {
    height: 55,
    color: "#898c8e",
    backgroundColor: "#ebecee",
    fontSize: 14,
    fontFamily: "HelveticaNeueLTPro-Md",
    overflow: "hidden",
  },
});

export default InformationField;
