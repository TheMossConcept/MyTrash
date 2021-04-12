import React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  AuthRequest,
  exchangeCodeAsync,
  makeRedirectUri,
  useAutoDiscovery,
} from "expo-auth-session";
import { Button } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  handleAuthorization: (tokenResponse: any) => void;
};

export default function AuthorizationButton({ handleAuthorization }: Props) {
  // Endpoint
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/65fa44cb-fe68-4b06-ad9f-d4343bd7589f/v2.0"
  );

  const redirectUri = makeRedirectUri({
    // For usage in bare and standalone
    native: "houe-plastic-recycling://one",
    path: "one",
  });

  const authRequest = new AuthRequest({
    clientId: "a67a4317-87b9-403b-8db9-e0227117bc8a",
    scopes: ["openid", "profile", "email", "offline_access"],
    // redirectUri: "houe-plastic-recycling://one",
    // For usage in managed apps using the proxy
    redirectUri,
  });

  // Request
  const onPress = async () => {
    if (discovery) {
      /* We don't care about the return value of this, but one of the side effects of it is that
       * the challenge and verifier is set up correctly. This is not the most elegant way of doing
       * it but that is the way the library works for now */
      await authRequest.getAuthRequestConfigAsync();
      const authSessionResult = await authRequest.promptAsync(discovery);
      console.log(authSessionResult.type);
      console.log(authRequest.codeVerifier);
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
            clientId: "a67a4317-87b9-403b-8db9-e0227117bc8a",
            redirectUri,
            extraParams: {
              code_verifier: authRequest.codeVerifier,
            },
          },
          discovery
        )
          .then((tokenResponse) => {
            console.log("Token response:")
            console.log(tokenResponse)
            handleAuthorization(tokenResponse);
          })
          .catch((error) => {
            console.log("ERROR: ");
            console.log(error);
          });
      }
    }
  };

  return <Button title="Login" onPress={onPress} />;
}
