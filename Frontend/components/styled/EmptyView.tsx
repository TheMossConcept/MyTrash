import React, { FC } from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

type Props = { text?: string; textStyle?: StyleProp<TextStyle> };

const EmptyView: FC<Props> = ({ text = "Listen er tom", textStyle }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.emptyText, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  emptyText: {
    fontSize: 34,
    color: "#9b9c9e",
    fontFamily: "HelveticaNeueLTPro-Hv",
    textAlign: "center",
  },
});

export default EmptyView;
