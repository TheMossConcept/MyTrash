import jwtDecode from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useCallback, useEffect, useState } from "react";

import { Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AuthRequest,
  DiscoveryDocument,
  makeRedirectUri,
} from "expo-auth-session";
import {
  AUTHORIZATION_URL,
  AZURE_AD_CLIENT_ID,
  MOBILE_REDIRECT_URL,
} from "react-native-dotenv";
import axios from "axios";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AdministrationScreen from "../screens/AdministrationScreen";
import CollectionAdministrationScreen from "../screens/CollectionAdministrationScreen";
import CollectionScreen from "../screens/CollectionScreen";
import LogisticsScreen from "../screens/LogisticsScreen";
import ProductionScreen from "../screens/ProductionScreen";
import RecipientScreen from "../screens/RecipientScreen";
import { TabsParamList, RootStackParamList } from "../typings/types";
import DismissableSnackbar, {
  useSnackbarState,
} from "../components/shared/DismissableSnackbar";

const Tab = createMaterialTopTabNavigator<TabsParamList>();

type UserInfo = {
  name: string;
  roles: string[];
  userId: string;
};

export const AccessTokenContext = React.createContext<string | undefined>(
  undefined
);

export const GlobalSnackbarContext = React.createContext<
  (title: string) => void
>(() => console.log("No show snackbar function passed along"));

type TabBarIconProps = {
  focused: boolean;
  color: string;
};

// TODO: Make into a higher order component and parametrize if necessary
const TabBarIcon: FC<TabBarIconProps> = ({ color }) => {
  return (
    <Ionicons
      size={30}
      style={{ marginBottom: -3 }}
      name="ios-code"
      color={color}
    />
  );
};

type Props = StackScreenProps<RootStackParamList, "Root">;

// TODO: Too much is going on in here! Split it out at some point
const TabNavigator: FC<Props> = ({ navigation, route }) => {
  const { accessToken, idToken } = route.params;

  // TODO: Extend this to handle refreshing the access token. Consider making it as a separate hook
  // that handles everything related to access and refresh tokens
  const [accessTokenState, setAccessToken] = useState<string | undefined>(
    accessToken
  );
  const logout = () => {
    setAccessToken(undefined);
    navigation.navigate("Login");
  };

  // TODO: ONLY FOR TESTING! IF THIS WORKS, MOVE IT OUT IMMEDIATELY
  const [discoveryDocument, setDiscoveryDocument] = useState<
    DiscoveryDocument | undefined
  >(undefined);

  // console.log(ENV);

  // NB! We cannot use autodiscovery in this case bacause it automatically appends /.well-known/openid-configuration to the URL and does
  // not support explicitly passing query parameters
  useEffect(() => {
    const updateDiscoveryDocument = async () => {
      const rawDiscoveryDocumentResponse = await axios.get(
        `${AUTHORIZATION_URL}?p=B2C_1_ProfileEdit`
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
  }, []);

  const redirectUri = makeRedirectUri({
    // For usage in bare and standalone
    native: MOBILE_REDIRECT_URL,
  });

  const authRequest = new AuthRequest({
    clientId: AZURE_AD_CLIENT_ID,
    scopes: ["openid"],
    extraParams: { p: "B2C_1_ProfileEdit" },
    redirectUri,
  });

  const editProfile = async () => {
    if (discoveryDocument) {
      await authRequest.getAuthRequestConfigAsync();
      const authSessionResult = await authRequest.promptAsync(
        discoveryDocument
      );
      console.log(authSessionResult);
    }
  };

  useEffect(() => {
    if (accessTokenState) {
      AsyncStorage.setItem("accessToken", accessTokenState);
    } else {
      AsyncStorage.removeItem("accessToken");
    }

    // TODO: Consider whether we need to clear this as well. For now, I
    // don't think so as we always get a new id token when logging in, however
    // potential stale state is always dangerous
    AsyncStorage.setItem("idToken", idToken);
  }, [accessTokenState, idToken]);

  const tokenDecoded = jwtDecode(idToken) as any;
  /* eslint-disable camelcase */
  const {
    given_name,
    family_name,
    oid,
    extension_Administrator,
    extension_CollectionAdministrator,
    extension_Collector,
    extension_LogisticsPartner,
    extension_RecipientPartner,
    extension_ProductionPartner,
  } = tokenDecoded;
  const name = family_name ? `${given_name} ${family_name}` : given_name;

  const userInfo: UserInfo = { roles: [], name, userId: oid };
  const colorScheme = useColorScheme();

  const globalSnackbarState = useSnackbarState();
  const [, dispatch] = globalSnackbarState;

  const showSnackbar = useCallback(
    (title: string) => {
      dispatch({ type: "updateTitle", payload: title });
      dispatch({ type: "show" });
    },
    [dispatch]
  );

  return (
    <AccessTokenContext.Provider value={accessTokenState}>
      <Appbar.Header>
        <Appbar.Content title={`Velkommen ${userInfo.name}`} />
        <Appbar.Action icon="account-edit" onPress={editProfile} />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <GlobalSnackbarContext.Provider value={showSnackbar}>
        <Tab.Navigator
          initialRouteName="Administration"
          tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
        >
          {extension_Administrator && (
            <Tab.Screen
              name="Administration"
              component={AdministrationScreen}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {extension_CollectionAdministrator && (
            <Tab.Screen
              name="Indsamlingsadministration"
              component={CollectionAdministrationScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {extension_Collector && (
            <Tab.Screen
              name="Indsamling"
              component={CollectionScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {extension_LogisticsPartner && (
            <Tab.Screen
              name="Logistik"
              component={LogisticsScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {extension_RecipientPartner && (
            <Tab.Screen
              name="Modtagelse"
              component={RecipientScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {extension_ProductionPartner && (
            <Tab.Screen
              name="Produktion"
              component={ProductionScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
        </Tab.Navigator>
      </GlobalSnackbarContext.Provider>
      <DismissableSnackbar globalSnackbarState={globalSnackbarState} />
    </AccessTokenContext.Provider>
  );
};
/* eslint-enable camelcase */

export default TabNavigator;
