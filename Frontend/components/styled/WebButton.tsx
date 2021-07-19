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
  icon?: { src: any; width?: number; height?: number };
  isSelected?: boolean;
} & TouchableOpacityProps;
export type MobileButtonProps = Props;

// TODO: Consider making a WebButton and a MobileButton
/* eslint-disable react/display-name */
const WebButton: FC<Props> = React.forwardRef<TouchableOpacity, Props>(
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
    let textColor = "#a3a5a8";

    if (isSelected) {
      containerStyles.push(styles.selected);
      textColor = "#44542d";
    } else {
      containerStyles.push(styles.unselected);

      // disabled/enabled styling only applies to non selected buttons. I am sure we can do this way more elegantly!!
      if (disabled === true) {
        containerStyles.push(styles.disabled);
        textColor = "#7b8463";
      } else if (disabled === false) {
        containerStyles.push(styles.enabled);
        textColor = "#44542d";
      } else {
        containerStyles.push(styles.notDisableable);
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
            color: textColor,
            marginLeft: 11,
            fontFamily: "HelveticaNeueLTPro-Bd",
            wordBreak: "break-word",
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
  notDisableable: {
    backgroundColor: "#e7e7e8",
  },
  disabled: {
    color: "#7b8463",
    backgroundColor: "#cdd89e",
  },
  enabled: {
    color: "#44542d",
    backgroundColor: "#728b3b",
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

export default WebButton;
