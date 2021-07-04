import React, { FC, useRef, useState } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Popover from "react-native-popover-view";

type Props = {};

const Menu: FC<Props> = () => {
  const [popoverIsShown, setPopoverIsShown] = useState(false);
  const dismissPopover = () => setPopoverIsShown(false);
  const popoverRef = useRef<Image>();

  return (
    <View style={styles.menuArea}>
      <TouchableOpacity onPress={() => setPopoverIsShown(true)}>
        <Image
          source={require("../../assets/icons/menu.png")}
          ref={popoverRef}
          style={styles.menuIcon}
        />
      </TouchableOpacity>
      <Popover
        from={popoverRef}
        isVisible={popoverIsShown}
        onRequestClose={dismissPopover}
      >
        <View style={styles.popoverContainer}>
          <Text style={styles.popoverText}>Rediger profil.</Text>
          <Text style={styles.popoverText}>Log ud.</Text>
        </View>
      </Popover>
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
  popoverContainer: {
    width: 200,
    height: 90,
    padding: 20,
    backgroundColor: "#d2d3c8",
  },
  popoverText: {
    marginBottom: 10,
    fontSize: 20,
    color: "#898c8e",
    borderBottomWidth: 2,
    borderBottomColor: "#e7e7e8",
    fontFamily: "HelveticaNeueLTPro-Hv",
  },
});

export default Menu;
