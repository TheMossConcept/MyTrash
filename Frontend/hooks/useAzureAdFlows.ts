import axios from "axios";
import {
  AuthRequest,
  AuthSessionResult,
  DiscoveryDocument,
  makeRedirectUri,
} from "expo-auth-session";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import getDefaultRedirectUri from "../utils/authorization";

export default function useAzureAdFlows(
  flowName: string,
  scopes: string[],
  redirectUri?: string
) {
  const { AUTHORIZATION_URL, AZURE_AD_CLIENT_ID, MOBILE_REDIRECT_URL } =
    Constants.manifest.extra;
  const [discoveryDocument, setDiscoveryDocument] = useState<
    DiscoveryDocument | undefined
  >(undefined);

  // NB! We cannot use autodiscovery in this case bacause it automatically appends /.well-known/openid-configuration to the URL and does
  // not support explicitly passing query parameters
  useEffect(() => {
    const updateDiscoveryDocument = async () => {
      const rawDiscoveryDocumentResponse = await axios.get(
        `${AUTHORIZATION_URL}?p=${flowName}`
      );
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
  }, [flowName]);

  const defaultRedirectUrl = getDefaultRedirectUri();
  const redirectUriForRequest = redirectUri || defaultRedirectUrl;

  const authRequest = new AuthRequest({
    clientId: AZURE_AD_CLIENT_ID,
    scopes,
    extraParams: { p: flowName },
    redirectUri: redirectUriForRequest,
  });

  const triggerFlow = async (
    callback?: (
      authSessionResult: AuthSessionResult,
      authRequest: AuthRequest,
      discoveryDocument: DiscoveryDocument
    ) => void
  ) => {
    if (discoveryDocument) {
      /* We don't care about the return value of this, but one of the side effects of it is that
       * the challenge and verifier is set up correctly. This is not the most elegant way of doing
       * it but that is the way the library works for now :( :( */
      await authRequest.getAuthRequestConfigAsync();
      const authSessionResult = await authRequest.promptAsync(
        discoveryDocument
      );

      if (callback) {
        callback(authSessionResult, authRequest, discoveryDocument);
      }
    }
  };

  return triggerFlow;
}
