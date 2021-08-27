import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import { TokenResponse } from "expo-auth-session";
import React, { FC, useEffect, useState } from "react";
import AuthorizationButton from "../components/AuthorizationButton";
import { RootStackParamList } from "../typings/types";
import MobileButton from "../components/styled/MobileButton";
import BottomButtonContainer from "../components/styled/BottomButtonContainer";
import MainContentArea from "../components/styled/MainContentArea";
import Menu from "../components/shared/Menu";
import AppText from "../components/styled/AppText";
import HoueLogo from "../components/styled/HoueLogo";

type Props = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: FC<Props> = ({ navigation }) => {
  const { ENVIRONMENT_NAME } = Constants.manifest.extra || {};

  const loginWithTokenResponse = (tokenResponse: TokenResponse) => {
    const { idToken, accessToken } = tokenResponse;

    AsyncStorage.setItem("accessToken", accessToken);
    if (idToken) {
      AsyncStorage.setItem("idToken", idToken);
    }

    navigation.navigate("Root");
  };
  const [doTokenRefreshIfNecessary, setDoTokenRefreshIfNecessary] = useState<
    (() => Promise<TokenResponse> | undefined) | undefined
  >();

  // Every time we end up on the login page, we want to
  useEffect(() => {
    if (doTokenRefreshIfNecessary) {
      const loginWithRefreshTokenIfNecessary = async () => {
        const tokenResponse = await doTokenRefreshIfNecessary();

        if (tokenResponse) {
          loginWithTokenResponse(tokenResponse);
        }
      };

      loginWithRefreshTokenIfNecessary();
    }
  });

  const openMyTrashInfo = () => {
    Linking.openURL("https://www.houe.com/media/MyTrash_info.pdf");
  };

  const handleAuthorizationSuccess = (
    tokenResponse: TokenResponse,
    refreshTokenIfNecessary: () => Promise<TokenResponse> | undefined
  ) => {
    setDoTokenRefreshIfNecessary(refreshTokenIfNecessary);
    loginWithTokenResponse(tokenResponse);
  };

  return (
    <View style={styles.container}>
      <MainContentArea containerStyle={styles.mainContentAreaContainer}>
        {/* It does not make sense to show the menu items on the login screen
            as all of them requires you to be logged in */}
        <Menu loggedIn={false} />
        <HoueLogo />
        <View style={styles.textContainer}>
          <AppText
            text={`${ENVIRONMENT_NAME}. ${Linking.createURL(
              "/"
              // TODO: Better versioning
            )}. Version 1.4.1. Login a sint oluptatiur nusa doluptatem Occatur ulparcia es pro que in pa doloren imaios recescid et, quo doloria nis dellabore dolut hilla dit pos quidia volecto beatempero dolent.  Ut omnit, sam et ex ex exero.`}
          />
        </View>
      </MainContentArea>
      <BottomButtonContainer style={styles.bottomButtonContainer}>
        <AuthorizationButton
          style={styles.bottomButton}
          handleAuthorization={handleAuthorizationSuccess}
        />
        <MobileButton
          text="Opret bruger."
          onPress={() => navigation.push("Join", { clusterId: undefined })}
          icon={{
            src: require("../assets/icons/checkmark_grey.png"),
            width: 31,
            height: 31,
          }}
          style={styles.bottomButton}
        />
        <MobileButton
          text="MyTrash info."
          onPress={openMyTrashInfo}
          icon={{
            src: require("../assets/icons/leaf_grey.png"),
            width: 20.5,
            height: 32.5,
          }}
          style={[styles.bottomButton, styles.lastBottomButton]}
        />
      </BottomButtonContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  textContainer: {
    marginTop: 60,
  },
  mainContentAreaContainer: {
    height: "80%",
  },
  bottomButtonContainer: { height: "20%", minHeight: 165 },
  iconContainer: {
    // The image itself constitutes 4 % of the space
    marginTop: 100,
    alignItems: "center",
  },
  icon: {
    width: 49.5,
    height: 41.5,
  },
  bottomButton: {
    marginRight: 10,
    flex: 1,
  },
  lastBottomButton: { marginRight: 0 },
});

export default LoginScreen;
