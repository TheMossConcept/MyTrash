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
  isSelected?: boolean;
  isVerticalButton?: boolean;
} & TouchableOpacityProps;
export type StyledButtonProps = Props;

const StyledButton: FC<Props> = ({
  style,
  text,
  icon,
  isSelected = false,
  // TODO: Consider the pros/cons to making the vertical button its own
  // component as opposed to this boolean toggle
  isVerticalButton = false,
  ...touchableOpacityProps
}) => {
  const containerStyles: any[] = [styles.container];

  if (isVerticalButton) {
    containerStyles.push(styles.verticalButtonContainer);
  }
  if (isSelected) {
    containerStyles.push(styles.selected);
  } else {
    containerStyles.push(styles.unselected);
  }

  containerStyles.push(style);

  return (
    <TouchableOpacity style={containerStyles} {...touchableOpacityProps}>
      <Image
        source={icon.src}
        style={{ width: icon.width || 32, height: icon.height || 32 }}
      />
      <Text
        style={{
          fontSize: 15,
          color: isSelected ? "#7b8463" : "#a3a5a8",
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  unselected: {
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
  selected: {
    backgroundColor: "#c7d494",
    shadowColor: "#000",
    shadowOffset: {
      width: -1,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  verticalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default StyledButton;
