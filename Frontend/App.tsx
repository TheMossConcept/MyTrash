import "react-native-gesture-handler";

import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Theme } from "react-native-paper/lib/typescript/types";
import { useFonts } from "expo-font";
import Navigation from "./navigation";

const theme: Theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function App() {
  useFonts({
    "HelveticaNeueLTPro-Bd": require("./assets/fonts/HelveticaNeueLTPro-Bd.otf"),
    "HelveticaNeueLTPro-Hv": require("./assets/fonts/HelveticaNeueLTPro-Hv.otf"),
    "HelveticaNeueLTPro-Md": require("./assets/fonts/HelveticaNeueLTPro-Md.otf"),
  });

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Navigation colorScheme="light" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
