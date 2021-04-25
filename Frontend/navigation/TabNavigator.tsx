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

type IdTokenData = {
  name: string;
  roles: string[];
  oid: string;
};

export const AccessTokenContext = React.createContext<string | null>(null);
// export const UserIdentityContext = React.createContext()

type Props = StackScreenProps<RootStackParamList, "Root">;

const TabNavigator: FC<Props> = ({ navigation, route }) => {
  const { accessToken, idToken } = route.params;

  // TODO: Extend this to handle refreshing the access token. Consider making it as a separate hook
  // that handles everything related to access and refresh tokens
  const [accessTokenState, setAccessToken] = useState<string | null>(
    accessToken
  );
  const logout = () => {
    setAccessToken(null);
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

  const { roles, name, oid } = jwtDecode(idToken) as IdTokenData;
  const userInfo: UserInfo = { roles, name, userId: oid };
  const colorScheme = useColorScheme();

  const showAdministrationScreen = userInfo.roles.includes(
    "SolutionAdministrator"
  );
  const showCollectionAdministrationScreen = userInfo.roles.includes(
    "CollectionAdministrator"
  );
  const showCollectionScreen = userInfo.roles.includes("Collector");
  const showLogisticsScreen = userInfo.roles.includes("LogisticsPartner");
  const showProductionScreen = userInfo.roles.includes("ProductionPartner");
  const showRecipientScreen = userInfo.roles.includes("RecipientPartner");

  //  TODO_SESSION: Make a header, where you can see the name of the
  //  user that is logged in and get the opportunity to log out if you
  //  want to
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
            initialParams={{ userId: userInfo.userId }}
            options={{
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="ios-code" color={color} />
              ),
            }}
          />
        )}
        {showCollectionAdministrationScreen && (
          <Tab.Screen
            name="Indsamlingsadministration"
            component={CollectionAdministrationScreen}
            options={{
              tabBarIcon: ({ color }: { color: string }) => (
                <TabBarIcon name="ios-code" color={color} />
              ),
            }}
          />
        )}
        {showCollectionScreen && (
          <Tab.Screen
            name="Indsamling"
            component={CollectionScreen}
            options={{
              tabBarIcon: ({ color }: { color: string }) => (
                <TabBarIcon name="ios-code" color={color} />
              ),
            }}
          />
        )}
        {showLogisticsScreen && (
          <Tab.Screen
            name="Logistik"
            component={LogisticsScreen}
            options={{
              tabBarIcon: ({ color }: { color: string }) => (
                <TabBarIcon name="ios-code" color={color} />
              ),
            }}
          />
        )}
        {showRecipientScreen && (
          <Tab.Screen
            name="Modtagelse"
            component={RecipientScreen}
            options={{
              tabBarIcon: ({ color }: { color: string }) => (
                <TabBarIcon name="ios-code" color={color} />
              ),
            }}
          />
        )}
        {showProductionScreen && (
          <Tab.Screen
            name="Produktion"
            component={ProductionScreen}
            options={{
              tabBarIcon: ({ color }: { color: string }) => (
                <TabBarIcon name="ios-code" color={color} />
              ),
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
