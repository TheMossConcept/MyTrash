import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { AZURE_AD_CLIENT_ID } from "react-native-dotenv";
import { TokenResponse } from "expo-auth-session";
import React, { FC, useEffect, useState } from "react";
import AuthorizationButton from "../components/AuthorizationButton";
import useAzureAdFlows from "../hooks/useAzureAdFlows";
import { RootStackParamList } from "../typings/types";
import StyledButton from "../components/styled/Button";

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

  const scopes = [AZURE_AD_CLIENT_ID];
  const resetPassword = useAzureAdFlows("B2C_1_PasswordReset", scopes);
  const onResetPasswordPress = () => resetPassword();

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={require("../assets/images/backgrond.png")}
      >
        <Image source={require("../assets/icons/arrow.png")} />
        {/* <View style={styles.container}>
          <AuthorizationButton
            handleAuthorization={handleAuthorizationSuccess}
          />
          <Button title="NULSTIL KODEORD" onPress={onResetPasswordPress} />
        </View>
          */}
      </ImageBackground>
      <View style={styles.bottomButtonContainer}>
        <AuthorizationButton
          style={styles.bottomButton}
          handleAuthorization={handleAuthorizationSuccess}
        />
        <StyledButton
          text="Opret bruger."
          icon={require("../assets/icons/checkmark_grey.png")}
          style={styles.bottomButton}
        />
        <StyledButton
          text="Projekt."
          icon={require("../assets/icons/leaf_grey.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  imageBackground: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 85,
  },
  bottomButtonContainer: {
    backgroundColor: "#e7e7e8",
    flex: 15,
    width: "100%",
    flexDirection: "row",
    paddingVertical: 39,
    paddingHorizontal: 20,
  },
  bottomButton: {
    marginRight: 10,
  },
});

export default LoginScreen;
