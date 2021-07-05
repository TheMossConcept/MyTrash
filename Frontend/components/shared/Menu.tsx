import React, { FC, useRef, useState } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Popover from "react-native-popover-view";
import { AZURE_AD_CLIENT_ID } from "react-native-dotenv";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import useAzureAdFlows from "../../hooks/useAzureAdFlows";

type Props = {};

const Menu: FC<Props> = () => {
  const [popoverIsShown, setPopoverIsShown] = useState(false);
  const dismissPopover = () => setPopoverIsShown(false);
  const popoverRef = useRef<Image>();

  const scopes = ["93d698bf-5f62-4b7d-9a5b-cf9fa4dd0412"]; // [AZURE_AD_CLIENT_ID];
  // const redirectUri = "exp://login";

  const editProfile = useAzureAdFlows("B2C_1_ProfileEdit", scopes);
  const onEditProfilePress = () => editProfile();

  const navigation = useNavigation();

  const logout = () => {
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("idToken");
    navigation.navigate("Login");
  };

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
          <TouchableOpacity onPress={onEditProfilePress}>
            <Text style={styles.popoverText}>Rediger profil.</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.popoverText}>Log ud.</Text>
          </TouchableOpacity>
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
