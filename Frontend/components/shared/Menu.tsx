import React, { FC, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  Linking,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Popover from "react-native-popover-view";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Platform from "../../utils/platform";
import useAzureAdFlows from "../../hooks/useAzureAdFlows";
import useOutsideClickDetector from "../../hooks/useOutsideClickDetector";

type Props = { loggedIn?: boolean };

const Menu: FC<Props> = ({ loggedIn = true }) => {
  const { AZURE_AD_CLIENT_ID } = Constants.manifest.extra || {};
  const [popoverIsShown, setPopoverIsShown] = useState(false);

  const dismissPopover = () => setPopoverIsShown(false);
  const popoverRef = useRef<TouchableOpacity>(null);

  const scopes = [AZURE_AD_CLIENT_ID];

  const editProfile = useAzureAdFlows("B2C_1_ProfileEdit", scopes);
  const onEditProfilePress = () => {
    editProfile();
    setPopoverIsShown(false);
  };

  const navigation = useNavigation();

  const logout = () => {
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("userInfo");
    AsyncStorage.setItem("shouldPrompt", "true");

    navigation.navigate("Login");

    setPopoverIsShown(false);
  };

  const menuRef = useRef(null);
  const outsideClickHandler = () => {
    setPopoverIsShown(false);
  };
  useOutsideClickDetector(menuRef, outsideClickHandler);

  const openPrivacyPolicy = () => {
    Linking.openURL("https://www.houe.com/Brug-af-cookies");
    setPopoverIsShown(false);
  };

  return (
    <View style={styles.menuArea} ref={menuRef}>
      <TouchableOpacity
        onPress={() => setPopoverIsShown(!popoverIsShown)}
        ref={popoverRef}
      >
        <Image
          source={require("../../assets/icons/menu.png")}
          style={styles.menuIcon}
        />
      </TouchableOpacity>
      <Popover
        from={popoverRef}
        isVisible={popoverIsShown}
        onRequestClose={dismissPopover}
        verticalOffset={
          StatusBar.currentHeight && Platform.platformName === "android"
            ? -StatusBar.currentHeight
            : undefined
        }
      >
        <View style={styles.popoverContainer}>
          <View style={styles.menuItemsContainer}>
            {loggedIn === true && (
              <TouchableOpacity onPress={onEditProfilePress}>
                <Text style={styles.popoverText}>Rediger profil</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={openPrivacyPolicy}>
              <Text style={styles.popoverText}>Privatlivspolitik</Text>
            </TouchableOpacity>
            {loggedIn === true && (
              <TouchableOpacity onPress={logout}>
                <Text style={styles.popoverText}>Log ud</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  menuArea: {
    alignItems: "flex-end",
    zIndex: 99,
  },
  menuIcon: {
    width: 40,
    height: 25,
  },
  popoverContainer: {
    alignItems: "flex-end",
  },
  menuItemsContainer: {
    width: 220,
    zIndex: 999,
    padding: 20,
    paddingBottom: 5,
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
