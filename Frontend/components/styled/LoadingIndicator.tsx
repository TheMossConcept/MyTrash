import React, { FC } from "react";
import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";

type Props = {} & ViewProps;

const LoadingIndicator: FC<Props> = ({ style, ...viewProps }) => {
  return (
    <View style={[styles.container, style]} {...viewProps}>
      <ActivityIndicator color="#748c43" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;
