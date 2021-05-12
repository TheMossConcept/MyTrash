import jwtDecode from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useEffect, useState } from "react";

import { Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AdministrationScreen from "../screens/AdministrationScreen";
import CollectionAdministrationScreen from "../screens/CollectionAdministrationScreen";
import CollectionScreen from "../screens/CollectionScreen";
import LogisticsScreen from "../screens/LogisticsScreen";
import ProductionScreen from "../screens/ProductionScreen";
import RecipientScreen from "../screens/RecipientScreen";
import { TabsParamList, RootStackParamList } from "../typings/types";

const Tab = createMaterialTopTabNavigator<TabsParamList>();

type UserInfo = {
  name: string;
  roles: string[];
  userId: string;
};

export const AccessTokenContext = React.createContext<string | undefined>(
  undefined
);

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
  // eslint-disable camelcase
  const { given_name, family_name, oid } = tokenDecoded;
  const name = family_name ? `${given_name} ${family_name}` : given_name;

  console.log(tokenDecoded);
  const userInfo: UserInfo = { roles: [], name, userId: oid };
  const colorScheme = useColorScheme();

  const showAdministrationScreen =
    userInfo.roles?.includes("SolutionAdministrator") || true;
  const showCollectionAdministrationScreen =
    userInfo.roles?.includes("CollectionAdministrator") || true;
  const showCollectionScreen = userInfo.roles?.includes("Collector") || true;
  const showLogisticsScreen =
    userInfo.roles?.includes("LogisticsPartner") || true;
  const showProductionScreen =
    userInfo.roles?.includes("ProductionPartner") || true;
  const showRecipientScreen =
    userInfo.roles?.includes("RecipientPartner") || true;

  return (
    <AccessTokenContext.Provider value={accessTokenState}>
      <Appbar.Header>
        <Appbar.Content title={`Velkommen ${userInfo.name}`} />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <Tab.Navigator
        initialRouteName="Administration"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
      >
        {showAdministrationScreen && (
          <Tab.Screen
            name="Administration"
            component={AdministrationScreen}
            options={{
              tabBarIcon: TabBarIcon,
            }}
          />
        )}
        {showCollectionAdministrationScreen && (
          <Tab.Screen
            name="Indsamlingsadministration"
            component={CollectionAdministrationScreen}
            initialParams={{ userId: userInfo.userId }}
            options={{
              tabBarIcon: TabBarIcon,
            }}
          />
        )}
        {showCollectionScreen && (
          <Tab.Screen
            name="Indsamling"
            component={CollectionScreen}
            initialParams={{ userId: userInfo.userId }}
            options={{
              tabBarIcon: TabBarIcon,
            }}
          />
        )}
        {showLogisticsScreen && (
          <Tab.Screen
            name="Logistik"
            component={LogisticsScreen}
            initialParams={{ userId: userInfo.userId }}
            options={{
              tabBarIcon: TabBarIcon,
            }}
          />
        )}
        {showRecipientScreen && (
          <Tab.Screen
            name="Modtagelse"
            component={RecipientScreen}
            initialParams={{ userId: userInfo.userId }}
            options={{
              tabBarIcon: TabBarIcon,
            }}
          />
        )}
        {showProductionScreen && (
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
    </AccessTokenContext.Provider>
  );
};

export default TabNavigator;

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
/*
function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return (
    <Ionicons
      size={30}
      style={{ marginBottom: -3 }}
      name={name}
      color={color}
    />
  );
}
 */
