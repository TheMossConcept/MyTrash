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
export type MobileButtonProps = Props;

// TODO: Consider making a WebButton and a MobileButton
/* eslint-disable react/display-name */
const MobileButton: FC<Props> = React.forwardRef<TouchableOpacity, Props>(
  (
    {
      style,
      text,
      icon,
      disabled,
      isSelected = false,
      // TODO: Consider the pros/cons to making the vertical button its own
      // component as opposed to this boolean toggle
      isVerticalButton = false,
      ...touchableOpacityProps
    },
    ref
  ) => {
    const containerStyles: any[] = [styles.container];

    if (isVerticalButton) {
      containerStyles.push(styles.verticalButtonContainer);
    }

    if (isSelected) {
      containerStyles.push(styles.selected);
    } else {
      containerStyles.push(styles.unselected);

      // disabled/enabled styling only applies to non selected buttons. I am sure we can do this way more elegantly!!
      if (disabled) {
        containerStyles.push(styles.disabled);
      } else {
        containerStyles.push(styles.enabled);
      }
    }

    containerStyles.push(style);

    return (
      <TouchableOpacity
        style={containerStyles}
        disabled={disabled}
        ref={ref}
        {...touchableOpacityProps}
      >
        {icon && (
          <Image
            source={icon.src}
            style={{ width: icon.width || 32, height: icon.height || 32 }}
          />
        )}
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
  }
);
/* eslint-enable react/display-name */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  disabled: {
    backgroundColor: "#d7d7d8",
  },
  enabled: {
    backgroundColor: "#e7e7e8",
  },
  unselected: {
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
  webButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default MobileButton;
