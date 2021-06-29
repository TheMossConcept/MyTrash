import React, { FC } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Props = { text: string; icon: any } & TouchableOpacityProps;
export type StyledButtonProps = Props;

const StyledButton: FC<Props> = ({ style, text, icon }) => {
  return (
    <TouchableOpacity style={[styles.container, style]}>
      <Image source={icon} style={{ width: 32, height: 32 }} />
      <Text style={{ fontSize: 15, color: "#7b8463" }}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#e7e7e8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 13,
    paddingLeft: 13,
  },
});

export default StyledButton;
