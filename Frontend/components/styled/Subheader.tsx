import React, { FC } from "react";
import { TextProps, Text, StyleSheet } from "react-native";

type Props = Omit<TextProps, "style">;

const CategoryHeadline: FC<Props> = ({ children, ...rest }) => {
  return (
    <Text style={styles.subheader} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  subheader: {
    fontSize: 22,
    color: "rgba(0, 0, 0, 0.54)",
    fontWeight: "600" as "600",
  },
});

export default CategoryHeadline;
