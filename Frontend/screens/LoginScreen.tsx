import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { Image, StyleSheet, View } from "react-native";
import { TokenResponse } from "expo-auth-session";
import { ENV } from "react-native-dotenv";
import React, { FC, useEffect, useState } from "react";
import AuthorizationButton from "../components/AuthorizationButton";
import { RootStackParamList } from "../typings/types";
import StyledButton from "../components/styled/Button";
import BottomButtonContainer from "../components/styled/BottomButtonContainer";
import MainContentArea from "../components/styled/MainContentArea";
import Menu from "../components/shared/Menu";
import HeadlineText from "../components/styled/HeadlineText";
import AppText from "../components/styled/AppText";

type Props = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: FC<Props> = ({ navigation }) => {
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
      <MainContentArea>
        <Menu />
        <HeadlineText style={{ marginTop: 54 }} />
        <View style={styles.textContainer}>
          <AppText text="Login a sint oluptatiur nusa doluptatem Occatur ulparcia es pro que in pa doloren imaios recescid et, quo doloria nis dellabore dolut hilla dit pos quidia volecto beatempero dolent.  Ut omnit, sam et ex ex exero" />
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={{
              src: require("../assets/icons/arrow.png"),
              width: 31,
              height: 31,
            }}
            style={styles.icon}
          />
        </View>
      </MainContentArea>
      <BottomButtonContainer>
        <AuthorizationButton
          style={styles.bottomButton}
          handleAuthorization={handleAuthorizationSuccess}
        />
        <StyledButton
          text="Opret bruger."
          icon={{
            src: require("../assets/icons/checkmark_grey.png"),
            width: 31,
            height: 31,
          }}
          style={styles.bottomButton}
        />
        <StyledButton
          text="Projekt."
          icon={{
            src: require("../assets/icons/leaf_grey.png"),
            width: 20.5,
            height: 32.5,
          }}
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
  },
});

export default LoginScreen;
