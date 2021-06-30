import React, { FC } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Props = {
  text: string;
  icon: { src: any; width?: number; height?: number };
  isVerticalButton?: boolean;
} & TouchableOpacityProps;
export type StyledButtonProps = Props;

const StyledButton: FC<Props> = ({
  style,
  text,
  icon,
  isVerticalButton = false,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity
      style={
        isVerticalButton
          ? [styles.container, styles.verticalButtonContainer, style]
          : [styles.container, style]
      }
      {...touchableOpacityProps}
    >
      <Image
        source={icon.src}
        style={{ width: icon.width || 32, height: icon.height || 32 }}
      />
      <Text
        style={{
          fontSize: 15,
          color: "#a3a5a8",
          textAlign: isVerticalButton ? "right" : undefined,
          fontFamily: "HelveticaNeueLTPro-Bd",
        }}
      >
        {text}
      </Text>
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
    paddingHorizontal: 13,
  },
  verticalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default StyledButton;
