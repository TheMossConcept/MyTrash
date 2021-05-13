import { StyleSheet, TextProps, Text } from "react-native";
import React, { FC } from "react";

type Props = TextProps;

const InformationText: FC<Props> = ({ children, ...rest }) => {
  return (
    <Text style={styles.text} {...rest}>
      {children}
    </Text>
  );
};

export default InformationText;

const styles = StyleSheet.create({
  text: {
    marginBottom: 5,
    paddingBottom: 5,
    textWeight: 600 as 600,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    borderBottomStyle: "solid" as "solid",
    width: "fit-content",
  },
});
