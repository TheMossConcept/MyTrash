import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  StackScreenProps,
} from "@react-navigation/stack";
import React, { FC } from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AdministrationScreen from "../screens/AdministrationScreen";
import CollectionScreen from "../screens/CollectionScreen";
import {
  TabsParamList,
  RootStackParamList,
} from "../types";

const Tab = createMaterialTopTabNavigator<TabsParamList>();

type Props = StackScreenProps<RootStackParamList, "Root">;

const TabNavigator: FC<Props> = () => {
  const colorScheme = useColorScheme();

  return (
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
        name="Indsamling"
        component={CollectionScreen}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
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
