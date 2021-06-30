import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = { text?: string };

const HeadlineText: FC<Props> = ({ text = "HOUE" }) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 54,
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
