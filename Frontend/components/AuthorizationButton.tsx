import React, { useEffect, useState } from "react";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import {
  AuthRequest,
  DiscoveryDocument,
  exchangeCodeAsync,
  makeRedirectUri,
} from "expo-auth-session";
import { Button, Text, View } from "react-native";
import {
  AUTHORIZATION_URL,
  AZURE_AD_CLIENT_ID,
  MOBILE_REDIRECT_URL,
  ENV,
} from "react-native-dotenv";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  handleAuthorization: (tokenResponse: any) => void;
};

export default function AuthorizationButton({ handleAuthorization }: Props) {
  const [discoveryDocument, setDiscoveryDocument] = useState<
    DiscoveryDocument | undefined
  >(undefined);

  console.log(ENV);

  // NB! We cannot use autodiscovery in this case bacause it automatically appends /.well-known/openid-configuration to the URL and does
  // not support explicitly passing query parameters
  useEffect(() => {
    const updateDiscoveryDocument = async () => {
      const rawDiscoveryDocumentResponse = await axios.get(AUTHORIZATION_URL);
      const {
        /* eslint-disable camelcase */
        authorization_endpoint,
        token_endpoint,
        end_session_endpoint,
        ...discoveryMetaData
      } = rawDiscoveryDocumentResponse.data;

      const convertedEndpointValues = {
        // The auth request assumes these URLs have no query param, which is why
        // we need to remove the query param here and reintroduce it when doing the requests
        // TODO: See if you can find a less brittle way to do this!
        authorizationEndpoint: (authorization_endpoint as string).split("?")[0],
        tokenEndpoint: token_endpoint,
        endSessionEndpoint: (end_session_endpoint as string).split("?")[0],
      };
      /* eslint-enable camelcase */

      const convertedDiscoveryDocument: DiscoveryDocument = {
        ...convertedEndpointValues,
        ...discoveryMetaData,
      };

      setDiscoveryDocument(convertedDiscoveryDocument);
    };

    updateDiscoveryDocument();
  }, []);

  // "https://mossconsultingorg.b2clogin.com/mossconsultingorg.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpAndSignIn";
  // "https://login.microsoftonline.com/12ca994f-d987-42e1-8ef2-27f9c922d145/v2.0";
  const redirectUri = makeRedirectUri({
    // For usage in bare and standalone
    native: MOBILE_REDIRECT_URL,
  });

  // NB! There's a bug in Azure AD B2C that causes only an id token to be
  // return if openid is included in scopes. See https://docs.microsoft.com/en-us/answers/questions/135912/azure-ad-b2c-access-token-missing.html
  const scopes = [AZURE_AD_CLIENT_ID, "profile", "email", "offline_access"];

  const authRequest = new AuthRequest({
    clientId: AZURE_AD_CLIENT_ID,
    scopes,
    extraParams: { p: "B2C_1_SignUpAndSignIn" },
    redirectUri,
  });

  // Request
  const onPress = async () => {
    if (discoveryDocument) {
      /* We don't care about the return value of this, but one of the side effects of it is that
       * the challenge and verifier is set up correctly. This is not the most elegant way of doing
       * it but that is the way the library works for now :( :( */
      await authRequest.getAuthRequestConfigAsync();
      const authSessionResult = await authRequest.promptAsync(
        discoveryDocument
      );
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
              p: "B2C_1_SignUpAndSignIn",
            },
          },
          discoveryDocument
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

  return (
    <View>
      <Text>{ENV}</Text>
      <Button title="Login" onPress={onPress} />
    </View>
  );
}
