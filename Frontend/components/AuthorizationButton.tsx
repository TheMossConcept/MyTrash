import React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  AuthRequest,
  exchangeCodeAsync,
  makeRedirectUri,
  useAutoDiscovery,
} from "expo-auth-session";
import { Button } from "react-native";
import { AUTHORIZATION_URL, AZURE_AD_CLIENT_ID } from "react-native-dotenv";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  handleAuthorization: (tokenResponse: any) => void;
};

export default function AuthorizationButton({ handleAuthorization }: Props) {
  const discovery = useAutoDiscovery(AUTHORIZATION_URL);

  const redirectUri = makeRedirectUri({
    // For usage in bare and standalone
    // TODO: Fix the hardcoding and make this environment specific!
    native: "exp://login",
  });

  const authRequest = new AuthRequest({
    clientId: AZURE_AD_CLIENT_ID,
    scopes: ["openid", "profile", "email", "offline_access"],
    redirectUri,
  });

  // Request
  const onPress = async () => {
    if (discovery) {
      /* We don't care about the return value of this, but one of the side effects of it is that
       * the challenge and verifier is set up correctly. This is not the most elegant way of doing
       * it but that is the way the library works for now :( :( */
      await authRequest.getAuthRequestConfigAsync();
      const authSessionResult = await authRequest.promptAsync(discovery);
      if (
        authSessionResult &&
        authSessionResult.type === "success" &&
        authRequest.codeVerifier &&
        discovery
      ) {
        exchangeCodeAsync(
          {
            code: authSessionResult.params.code,
            scopes: ["openid", "profile", "email", "offline_access"],
            // TODO: Fix teh hardcoding!
            clientId: AZURE_AD_CLIENT_ID,
            redirectUri,
            extraParams: {
              code_verifier: authRequest.codeVerifier,
            },
          },
          discovery
        )
          .then((tokenResponse) => {
            handleAuthorization(tokenResponse);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.warn(error);
          });
      }
    }
  };

  return <Button title="Login" onPress={onPress} />;
}
