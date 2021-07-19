import React, { FC } from "react";
import {
  View,
  ImageBackground,
  ImageBackgroundProps,
  SafeAreaView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

type Props = { containerStyle?: StyleProp<ViewStyle>; isWeb?: boolean } & Omit<
  ImageBackgroundProps,
  "source" | "style"
>;

const MainContentArea: FC<Props> = ({
  children,
  containerStyle,
  isWeb = false,
  ...imageBackgroundProps
}) => {
  return (
    <View style={containerStyle}>
      <ImageBackground
        // TODO: Do something less brittle here than relying on the naming convention!
        source={
          isWeb
            ? require("../../assets/images/background_web.png")
            : require("../../assets/images/background.png")
        }
        // If this is not an array, the width does not go all the way out for whatever reason
        style={[styles.imageBackground]}
        {...imageBackgroundProps}
      >
        <SafeAreaView style={{ height: "100%" }}>{children}</SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: "100%",
    paddingTop: 64,
    paddingHorizontal: 49,
  },
});

export default MainContentArea;
