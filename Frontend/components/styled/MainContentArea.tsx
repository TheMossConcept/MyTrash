import React, { FC } from "react";
import {
  View,
  ImageBackground,
  ImageBackgroundProps,
  SafeAreaView,
  StyleSheet,
} from "react-native";

type Props = {} & Omit<ImageBackgroundProps, "source">;

const MainContentArea: FC<Props> = ({
  children,
  style,
  ...imageBackgroundProps
}) => {
  return (
    <View style={{ height: "80%" }}>
      <ImageBackground
        source={require("../../assets/images/backgrond.png")}
        style={[styles.imageBackground, style]}
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
