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

import Constants from "expo-constants";
import useAzureAdFlows from "../hooks/useAzureAdFlows";
import StyledButton, { StyledButtonProps } from "./styled/Button";
import getDefaultRedirectUri from "../utils/authorization";

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
  const { AZURE_AD_CLIENT_ID } = Constants.manifest.extra;
  const scopes = [AZURE_AD_CLIENT_ID, "profile", "email", "offline_access"];

  const defaultRedirectUrl = getDefaultRedirectUri();

  const signIn = useAzureAdFlows("B2C_1_SignIn", scopes, defaultRedirectUrl);

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
            redirectUri: defaultRedirectUrl,
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
      icon={{
        src: require("../assets/icons/circle_grey.png"),
        width: 31,
        height: 31,
      }}
      onPress={onPress}
      {...StyledButtonProps}
    />
  );
}
