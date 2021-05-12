import React, { FC } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = { style?: ViewStyle };

const Container: FC<Props> = ({ children, style }) => {
  // TODO: Add global view context here!
  const containerStyle = { ...styles.container, ...style };
  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});

export default Container;