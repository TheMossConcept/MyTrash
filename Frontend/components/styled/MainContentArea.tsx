import React, { FC } from "react";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import {
  View,
  ImageBackground,
  ImageBackgroundProps,
  SafeAreaView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  disableScroll?: boolean;
} & Omit<ImageBackgroundProps, "source" | "style">;

const MainContentArea: FC<Props> = ({
  children,
  containerStyle,
  disableScroll = false,
  ...imageBackgroundProps
}) => {
  return (
    <View style={containerStyle}>
      <ImageBackground
        // TODO: Do something less brittle here than relying on the naming convention!
        source={require("../../assets/images/background.png")}
        // If this is not an array, the width does not go all the way out for whatever reason
        style={[styles.imageBackground]}
        {...imageBackgroundProps}
      >
        {disableScroll ? (
          <View style={styles.childContainer}>
            <SafeAreaView>{children}</SafeAreaView>
          </View>
        ) : (
          <KeyboardAvoidingScrollView>
            <View style={styles.childContainer}>
              <SafeAreaView>{children}</SafeAreaView>
            </View>
          </KeyboardAvoidingScrollView>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: "100%",
  },
  childContainer: {
    height: "100%",
    paddingTop: 64,
    paddingHorizontal: 49,
  },
});

export default MainContentArea;
