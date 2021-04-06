import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  exchangeCodeAsync,
  Prompt,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { Button } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function AuthorizationButton() {
  // Endpoint
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/65fa44cb-fe68-4b06-ad9f-d4343bd7589f/v2.0"
  );
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "a67a4317-87b9-403b-8db9-e0227117bc8a",
      scopes: ["openid", "profile", "email", "offline_access"],
      // For usage in managed apps using the proxy
      redirectUri: "http://localhost:19006/one",
      prompt: Prompt.Login,
      codeChallenge: "ThisIsntRandomButItNeedsToBe43CharactersLong",
      /* redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: 'houe-plastic-recycling://react-native-auth/',
      }),
       */
    },
    discovery
  );

  useEffect(() => {
    console.log("Response changed and is now: ");
    console.log(response);
  }, [response]);

  useEffect(() => {
    console.log("Request change and is now: ");
    console.log(request);
  }, [request]);

  const onPress = async () => {
    const authSessionResult = await promptAsync();
    console.log(authSessionResult);

    if (
      authSessionResult &&
      authSessionResult.type === "success" &&
      discovery
    ) {
      const test = exchangeCodeAsync(
        {
          code: authSessionResult.params.code,
          scopes: ["openid", "profile", "email", "offline_access"],
          clientId: "a67a4317-87b9-403b-8db9-e0227117bc8a",
          redirectUri: "http://localhost:19006/one",
          extraParams: {
            code_verifier: "ThisIsntRandomButItNeedsToBe43CharactersLong",
          },
        },
        discovery
      )
        .then((tokenResponse) => {
          debugger;
          console.log("THE TOKEN RESPONSE: ");
          console.log(tokenResponse);
        })
        .catch((error) => {
          debugger;
          console.log("ERROR: ");
          console.log(error);
        });
      console.log(test);
    }
  };

  return <Button title="Login test" onPress={onPress} />;
}
