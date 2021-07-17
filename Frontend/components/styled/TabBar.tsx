import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TabBar: FC<MaterialTopTabBarProps> = ({ state, ...props }) => {
  return (
    <View style={styles.tabsContainer}>
      {state.routes.map((route, index) => (
        <TabBarItem
          route={route}
          isFocused={state.index === index}
          key={route.key}
          {...props}
        />
      ))}
    </View>
  );
};

type TabBarItemProps = {
  route: { key: string; name: string };
  isFocused: boolean;
} & Omit<MaterialTopTabBarProps, "state">;

const TabBarItem: FC<TabBarItemProps> = ({
  route,
  isFocused,
  descriptors,
  navigation,
}) => {
  const { options } = descriptors[route.key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexGrow: 0, flexShrink: 1, flexBasis: "auto" }}
    >
      <Text style={styles.tabText}>{route.name}</Text>
      {isFocused && <View style={styles.selectedLine} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "22%",
  },
  tabText: {
    fontFamily: "HelveticaNeueLTPro-Md",
    fontSize: 14,
    textAlign: "center",
    color: "#959691",
  },
  selectedLine: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#728b3b",
    marginTop: 12,
  },
});

export default TabBar;
