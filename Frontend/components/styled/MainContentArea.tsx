import React, { FC } from "react";
import {
  ImageBackground,
  ImageBackgroundProps,
  SafeAreaView,
  StyleSheet,
} from "react-native";

type Props = {} & ImageBackgroundProps;

const MainContentArea: FC<Props> = ({
  children,
  style,
  ...imageBackgroundProps
}) => {
  return (
    <ImageBackground
      style={[styles.imageBackground, style]}
      {...imageBackgroundProps}
    >
      <SafeAreaView>{children}</SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    flex: 85,
    paddingTop: 64,
    paddingHorizontal: 49,
  },
});

export default MainContentArea;
