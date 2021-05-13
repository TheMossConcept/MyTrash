import React, { FC } from "react";
import { TextProps, Text, StyleSheet } from "react-native";

type Props = TextProps;

const CategoryHeadline: FC<Props> = ({ children, ...rest }) => {
  return (
    <Text style={styles.headlineStyle} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  headlineStyle: {
    fontSize: 30,
    color: "rgba(0, 0, 0, 0.54)",
    fontWeight: "700",
    textAlign: "center",
  },
});

export default CategoryHeadline;
