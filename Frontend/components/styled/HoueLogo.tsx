import React, { FC } from "react";
import { View, Image, StyleSheet } from "react-native";

type Props = {};

const HoueLogo: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/logo.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: "center",
  },
  image: { height: 61.5, width: 148 },
});

export default HoueLogo;
