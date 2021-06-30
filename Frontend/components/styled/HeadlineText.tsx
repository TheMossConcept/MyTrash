import React, { FC } from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";

type Props = { text?: string } & ViewProps;

const HeadlineText: FC<Props> = ({ text = "HOUE", style, ...viewProps }) => {
  return (
    <View style={[styles.textContainer, style]} {...viewProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontSize: 42.5,
    color: "#898c8e",
    fontFamily: "HelveticaNeueLTPro-Hv",
  },
});

export default HeadlineText;
