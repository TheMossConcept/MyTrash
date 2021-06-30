import React, { FC } from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {};

const Menu: FC<Props> = () => {
  return (
    <View style={styles.menuArea}>
      <Image
        source={require("../../assets/icons/menu.png")}
        style={styles.menuIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuArea: {
    alignItems: "flex-end",
  },
  menuIcon: {
    width: 40,
    height: 25,
  },
});

export default Menu;
