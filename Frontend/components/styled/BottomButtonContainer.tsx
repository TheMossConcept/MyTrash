import React, { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = {} & Pick<ViewProps, "style">;

const BottomButtonContainer: FC<Props> = ({ children, style }) => {
  return <View style={[styles.bottomButtonContainer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  bottomButtonContainer: {
    backgroundColor: "#e7e7e8",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default BottomButtonContainer;
