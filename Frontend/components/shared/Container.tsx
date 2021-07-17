import React, { FC } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = { style?: ViewStyle };
export type ContainerProps = Props;

const Container: FC<Props> = ({ children, style }) => {
  // TODO: Add global view context here!
  const containerStyle = { ...styles.container, ...style };
  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export default Container;
