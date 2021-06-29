import React, { FC } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Props = {} & TouchableOpacityProps;

const Button: FC<Props> = ({ style }) => {
  return <TouchableOpacity style={[styles.container, style]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: "#e7e7e8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default Button;
