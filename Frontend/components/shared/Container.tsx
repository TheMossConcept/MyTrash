import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

type Props = {};

const Container: FC<Props> = ({ children }) => {
  // TODO: Add global view context here!
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    margin: "auto",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
});

export default Container;
