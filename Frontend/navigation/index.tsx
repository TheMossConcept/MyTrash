import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import LoginScreen from "../screens/LoginScreen";

import NotFoundScreen from "../screens/NotFoundScreen";
import JoinClusterScreen from "../screens/JoinClusterScreen";
import InvitationScreen from "../screens/InvitationScreen";
import { RootStackParamList } from "../typings/types";
import TabNavigator from "./TabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import DismissableSnackbar, {
  useSnackbarState,
} from "../components/shared/DismissableSnackbar";
import GlobalSnackbarContext from "../utils/globalContext";
import platform from "../utils/platform";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const theme =
    colorScheme === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            // The actual color does not matter as it is completely opaque
            // but make it black in dark theme for good measure
            background: "rgba(0, 0, 0, 0.0)",
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            // The actual color does not matter as it is completely opaque
            // but make it white in default theme for good measure
            background: "rgba(255, 255, 255, 0.0)",
          },
        };

  const globalSnackbarState = useSnackbarState();
  const [, dispatch] = globalSnackbarState;

  const showSnackbar = React.useCallback(
    (title: string, isError?: boolean) => {
      // This is not exactly the nicest way of handling this, but it should
      // work if nobody bypases the showSnackbar function!
      if (isError) {
        dispatch({ type: "updateStyle", payload: "error" });
      } else {
        dispatch({ type: "updateStyle", payload: "default" });
      }

      dispatch({ type: "updateTitle", payload: title });
      dispatch({ type: "show" });
    },
    [dispatch]
  );

  return (
    <GlobalSnackbarContext.Provider value={showSnackbar}>
      <NavigationContainer linking={LinkingConfiguration} theme={theme}>
        <RootNavigator />
        <DismissableSnackbar
          globalSnackbarState={globalSnackbarState}
          isWeb={platform.platformName === "web"}
        />
      </NavigationContainer>
    </GlobalSnackbarContext.Provider>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Join" component={JoinClusterScreen} />
      <Stack.Screen name="Invitation" component={InvitationScreen} />
      <Stack.Screen name="Root" component={TabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
