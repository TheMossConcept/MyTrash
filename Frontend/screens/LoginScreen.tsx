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
import HeadlineText from "../components/styled/HeadlineText";
import AppText from "../components/styled/AppText";

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

  const handleAuthorizationSuccess = (
    tokenResponse: TokenResponse,
    refreshTokenIfNecessary: () => Promise<TokenResponse> | undefined
  ) => {
    setDoTokenRefreshIfNecessary(refreshTokenIfNecessary);
    loginWithTokenResponse(tokenResponse);
  };

  return (
    <View style={styles.container}>
      <MainContentArea containerStyle={{ height: "80%" }}>
        {/* It does not make sense to show the menu items on the login screen
            as all of them requires you to be logged in */}
        <Menu hideMenuItems />
        <HeadlineText style={{ marginTop: 54 }} />
        <View style={styles.textContainer}>
          <AppText
            text={`${ENVIRONMENT_NAME}. ${Linking.createURL(
              "/"
              // TODO: Better versioning
            )}. Version 0.1.2. Login a sint oluptatiur nusa doluptatem Occatur ulparcia es pro que in pa doloren imaios recescid et, quo doloria nis dellabore dolut hilla dit pos quidia volecto beatempero dolent.  Ut omnit, sam et ex ex exero.`}
          />
        </View>
      </MainContentArea>
      <BottomButtonContainer style={{ height: "20%", minHeight: 165 }}>
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
          text="Projekt."
          icon={{
            src: require("../assets/icons/leaf_grey.png"),
            width: 20.5,
            height: 32.5,
          }}
          style={[styles.bottomButton, { marginRight: 0 }]}
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
});

export default LoginScreen;
