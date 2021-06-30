import React, { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = {} & ViewProps;

const MenuArea: FC<Props> = ({ children, style }) => {
  return <View style={[styles.menuArea, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  menuArea: {
    width: "100%",
    flex: 9,
  },
});

export default MenuArea;
