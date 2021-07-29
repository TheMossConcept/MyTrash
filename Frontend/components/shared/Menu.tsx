import React, { FC, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Popover from "react-native-popover-view";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import useAzureAdFlows from "../../hooks/useAzureAdFlows";
import platformUtils from "../../utils/platform";

type Props = { hideMenuItems?: boolean };

const Menu: FC<Props> = ({ hideMenuItems = false }) => {
  const { AZURE_AD_CLIENT_ID } = Constants.manifest.extra || {};
  const [popoverIsShown, setPopoverIsShown] = useState(false);

  const dismissPopover = () => setPopoverIsShown(false);
  const popoverRef = useRef<Image>(null);

  const scopes = [AZURE_AD_CLIENT_ID];

  const editProfile = useAzureAdFlows("B2C_1_ProfileEdit", scopes);
  const onEditProfilePress = () => editProfile();

  const navigation = useNavigation();

  const logout = () => {
    AsyncStorage.removeItem("accessToken");
    AsyncStorage.removeItem("idToken");
    navigation.navigate("Login");
  };

  useEffect(() => {
    if (platformUtils.platformName === "web") {
      const globalClickEventListener = function (event: any) {
        // TODO: This (relying on the string value of the src of the srcElement
        // and relying on a global event handler) is insanely brittle and this
        // entire global event listener is ONLY meant as a temporary workaround
        // until react-native-popover-view gets proper web support !!
        if (
          event.srcElement.src !==
          `${window.location.origin}/static/media/menu.c165fe87.png`
        ) {
          setPopoverIsShown(false);
        }
      };

      document.addEventListener("click", globalClickEventListener);

      return () => {
        document.removeEventListener("click", globalClickEventListener);
      };
    }

    return () => {};
  }, []);

  return (
    <View style={styles.menuArea}>
      <TouchableOpacity
        onPress={() => setPopoverIsShown(!popoverIsShown)}
        disabled={hideMenuItems}
      >
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
          <View style={styles.menuItemsContainer}>
            <TouchableOpacity onPress={onEditProfilePress}>
              <Text style={styles.popoverText}>Rediger profil.</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.popoverText}>Log ud.</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: "flex-end",
  },
  menuItemsContainer: {
    width: 200,
    height: 110,
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
