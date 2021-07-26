import "react-native-gesture-handler";

import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Theme } from "react-native-paper/lib/typescript/types";
import { useFonts } from "expo-font";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Navigation from "./navigation";

const theme: Theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function App() {
  const [loaded] = useFonts({
    "HelveticaNeueLTPro-Bd": require("./assets/fonts/HelveticaNeueLTPro-Bd.otf"),
    "HelveticaNeueLTPro-Hv": require("./assets/fonts/HelveticaNeueLTPro-Hv.otf"),
    "HelveticaNeueLTPro-Md": require("./assets/fonts/HelveticaNeueLTPro-Md.otf"),
    "AvantGarde-Medium": require("./assets/fonts/AvantGarde-Medium.ttf"),
  });

  return loaded ? (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Navigation colorScheme="light" />
      </PaperProvider>
    </SafeAreaProvider>
  ) : (
    <View>
      <ActivityIndicator style={styles.loadingContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
