import React, { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type Props = {};

const LoadingIndicator: FC<Props> = () => {
  return (
    <View style={styles.container}>
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
