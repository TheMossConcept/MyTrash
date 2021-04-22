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

export const AccessTokenContext = React.createContext<string | undefined>(
  undefined
);

type Props = StackScreenProps<RootStackParamList, "Root">;

const TabNavigator: FC<Props> = ({ route }) => {
  const { accessToken } = route.params;
  console.log(`Access token in TabNavigator: ${accessToken}`);
  const colorScheme = useColorScheme();

  return (
    <AccessTokenContext.Provider value={accessToken}>
      <Tab.Navigator
        initialRouteName="Administration"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
      >
        <Tab.Screen
          name="Administration"
          component={AdministrationScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="ios-code" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Indsamlingsadministration"
          component={CollectionAdministrationScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <TabBarIcon name="ios-code" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Indsamling"
          component={CollectionScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <TabBarIcon name="ios-code" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Logistik"
          component={LogisticsScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <TabBarIcon name="ios-code" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Modtagelse"
          component={RecipientScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <TabBarIcon name="ios-code" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Produktion"
          component={ProductionScreen}
          options={{
            tabBarIcon: ({ color }: { color: string }) => (
              <TabBarIcon name="ios-code" color={color} />
            ),
          }}
        />
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
