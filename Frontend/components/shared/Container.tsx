import React, { FC } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

type Props = { style?: ViewStyle };
export type ContainerProps = Props;

const Container: FC<Props> = ({ children, style }) => {
  // TODO: Add global view context here!
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    // overflow: "scroll",
  },
});

export default Container;
