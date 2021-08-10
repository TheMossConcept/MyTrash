import "react-native-gesture-handler";

import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Theme } from "react-native-paper/lib/typescript/types";
import { useFonts } from "expo-font";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { useAssets } from "expo-asset";
import Navigation from "./navigation";

const theme: Theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "HelveticaNeueLTPro-Bd": require("./assets/fonts/HelveticaNeueLTPro-Bd.otf"),
    "HelveticaNeueLTPro-Hv": require("./assets/fonts/HelveticaNeueLTPro-Hv.otf"),
    "HelveticaNeueLTPro-Md": require("./assets/fonts/HelveticaNeueLTPro-Md.otf"),
    "AvantGarde-Medium": require("./assets/fonts/AvantGarde-Medium.ttf"),
  });

  const [assets] = useAssets([
    require("./assets/images/background.png"),
    require("./assets/images/background_web.png"),
  ]);

  const loaded = fontsLoaded && assets !== undefined;

  const handleGlobalPress = (event: GestureResponderEvent) => {
    EventRegister.emit("globalPress", event);
  };

  return loaded ? (
    <TouchableWithoutFeedback
      style={styles.fullScreenContainer}
      onPress={handleGlobalPress}
    >
      <View style={styles.fullScreenContainer}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <Navigation colorScheme="light" />
          </PaperProvider>
        </SafeAreaProvider>
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <View style={styles.fullScreenContainer}>
      <ActivityIndicator style={styles.loadingContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    height: "100%",
    width: "100%",
  },
  loadingContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
