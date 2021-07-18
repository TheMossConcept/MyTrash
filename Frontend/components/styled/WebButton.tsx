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
  isWebButton?: boolean;
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
      ...touchableOpacityProps
    },
    ref
  ) => {
    const containerStyles: any[] = [styles.container];

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
            color: isSelected ? "#44542d" : "#a3a5a8",
            marginLeft: 11,
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
    backgroundColor: "#728b3b",
    shadowColor: "#000",
    shadowOffset: {
      width: -1,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default MobileButton;
