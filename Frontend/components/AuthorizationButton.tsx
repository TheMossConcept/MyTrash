import React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  AuthRequest,
  AuthSessionResult,
  DiscoveryDocument,
  exchangeCodeAsync,
  makeRedirectUri,
  refreshAsync,
  TokenResponse,
} from "expo-auth-session";

import { AZURE_AD_CLIENT_ID, MOBILE_REDIRECT_URL } from "react-native-dotenv";
import useAzureAdFlows from "../hooks/useAzureAdFlows";
import StyledButton, { StyledButtonProps } from "./styled/Button";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  handleAuthorization: (
    tokenResponse: TokenResponse,
    refreshTokenIfNecessary: () => Promise<TokenResponse> | undefined
  ) => void;
} & Omit<StyledButtonProps, "text" | "icon">;

export default function AuthorizationButton({
  handleAuthorization,
  ...StyledButtonProps
}: Props) {
  const scopes = [AZURE_AD_CLIENT_ID, "profile", "email", "offline_access"];
  const redirectUri = makeRedirectUri({
    // For usage in bare and standalone
    native: MOBILE_REDIRECT_URL,
  });

  const signIn = useAzureAdFlows("B2C_1_SignIn", scopes, redirectUri);

  // Request
  const onPress = async () => {
    const getAccessTokenFromCode = (
      authSessionResult: AuthSessionResult,
      authRequest: AuthRequest,
      discoveryDocument: DiscoveryDocument
    ) => {
      if (
        authSessionResult &&
        authSessionResult.type === "success" &&
        authRequest.codeVerifier &&
        discoveryDocument
      ) {
        exchangeCodeAsync(
          {
            code: authSessionResult.params.code,
            scopes,
            clientId: AZURE_AD_CLIENT_ID,
            redirectUri,
            extraParams: {
              code_verifier: authRequest.codeVerifier,
              p: "B2C_1_SignIn",
            },
          },
          discoveryDocument
        )
          .then((tokenResponse) => {
            const refreshTokenIfNecessary = () => {
              if (tokenResponse.shouldRefresh()) {
                return refreshAsync(
                  {
                    clientId: AZURE_AD_CLIENT_ID,
                    scopes,
                    refreshToken: tokenResponse.refreshToken,
                  },
                  discoveryDocument
                );
              }
              return undefined;
            };

            handleAuthorization(tokenResponse, refreshTokenIfNecessary);
            // TODO: Add global refresh token event handler here
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.warn(error);
          });
      }
    };

    signIn(getAccessTokenFromCode);
  };

  return (
    <StyledButton
      text="Login"
      icon={require("../assets/icons/circle_grey.png")}
      onPress={onPress}
      {...StyledButtonProps}
    />
  );
}
