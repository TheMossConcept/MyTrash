import React, { FC } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import platform from "../../utils/platform";

type Props = { style?: ViewStyle };
export type ContainerProps = Props;

const Container: FC<Props> = ({ children, style }) => {
  // TODO: Add global view context here!
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: platform.platformName === "web" ? "100vh" : "100%",
  },
});

export default Container;
