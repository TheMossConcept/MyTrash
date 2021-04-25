import jwtDecode from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";

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
};

export const AccessTokenContext = React.createContext<string | undefined>(
  undefined
);

export const UserInfoContext = React.createContext<UserInfo | undefined>(
  undefined
);
// export const UserIdentityContext = React.createContext()

type Props = StackScreenProps<RootStackParamList, "Root">;

const TabNavigator: FC<Props> = ({ route }) => {
  const { accessToken, idToken } = route.params;

  const userInfo: UserInfo = jwtDecode(idToken);
  console.log(userInfo);
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
    <AccessTokenContext.Provider value={accessToken}>
      <UserInfoContext.Provider value={userInfo}>
        <Tab.Navigator
          initialRouteName="Administration"
          tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
        >
          {showAdministrationScreen && (
            <Tab.Screen
              name="Administration"
              component={AdministrationScreen}
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
      </UserInfoContext.Provider>
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
