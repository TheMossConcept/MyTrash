import React, { FC, useRef } from "react";
import { EventRegister } from "react-native-event-listeners";
import {
  View,
  ImageBackground,
  ImageBackgroundProps,
  SafeAreaView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useAssets } from "expo-asset";
import Platform from "../../utils/platform";
import LoadingIndicator from "./LoadingIndicator";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  disableScroll?: boolean;
} & Omit<ImageBackgroundProps, "source" | "style">;

export const ScrollViewContext =
  React.createContext<React.MutableRefObject<ScrollView | null> | null>(null);

const MainContentArea: FC<Props> = ({
  children,
  containerStyle,
  disableScroll = false,
  ...imageBackgroundProps
}) => {
  const isWeb = Platform.platformName === "web";

  const scrollViewRef = useRef<ScrollView | null>(null);

  const handleGlobalPress = (event: GestureResponderEvent) => {
    EventRegister.emit("globalPress", event);
  };

  const [assets] = useAssets([require("../../assets/images/background.png")]);

  return !assets ? (
    <View style={[styles.contentContainer, styles.loadingContainer]}>
      <LoadingIndicator />
    </View>
  ) : (
    <View style={containerStyle}>
      <ImageBackground
        // TODO: Do something less brittle here than relying on the naming convention!
        source={{ uri: assets[0].localUri || assets[0].uri }}
        // If this is not an array, the width does not go all the way out for whatever reason
        style={[styles.contentContainer]}
        {...imageBackgroundProps}
      >
        {disableScroll || isWeb ? (
          <TouchableWithoutFeedback onPress={handleGlobalPress}>
            <View style={styles.childContainer}>
              <SafeAreaView>{children}</SafeAreaView>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.platformName === "ios" ? "padding" : "height"}
          >
            <ScrollView keyboardShouldPersistTaps="handled" ref={scrollViewRef}>
              <ScrollViewContext.Provider value={scrollViewRef}>
                <TouchableWithoutFeedback onPress={handleGlobalPress}>
                  <View style={styles.childContainer}>
                    <SafeAreaView>{children}</SafeAreaView>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollViewContext.Provider>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  childContainer: {
    height: "100%",
    paddingTop: 64,
    paddingHorizontal: 49,
  },
});

export default MainContentArea;
