import React, { FC } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  options: string[];
  selectionState: [string, (newValue: string) => void];
};

const ContextSelector: FC<Props> = ({ children, options, selectionState }) => {
  const [selectedOption, setSelectedOption] = selectionState;

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.selectionImageContainer}>
          <Image
            source={require("../../assets/icons/selection_arrow.png")}
            style={styles.selectionImage}
          />
        </View>
        <View style={styles.selectorMenu}>
          {options.map((option, index) => {
            const isLastOption = index === options.length - 1;
            const isSelected = option === selectedOption;

            const style: StyleProp<TextStyle> = [styles.menuText];
            if (isSelected) {
              style.push({ color: "#728b3b" });
            }
            if (isLastOption) {
              style.push({ marginBottom: 0 });
            }

            return (
              <TouchableOpacity
                key={option}
                onPress={() => setSelectedOption(option)}
              >
                <Text style={style}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.rightAreaContainer}>
        <Text style={styles.selectionText}>{selectedOption}.</Text>
        <View style={styles.contentContainer}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  selectorMenu: {
    borderRightWidth: 2,
    borderRightColor: "#9a9c9f",
    borderStyle: "solid",
    paddingRight: 26,
    width: "fit-content",
    paddingTop: 60,
    paddingBottom: 20,
  },
  rightAreaContainer: {
    marginLeft: 124,
  },
  contentContainer: {
    marginTop: 39,
  },
  selectionImageContainer: {
    width: "fit-content",
    marginLeft: 96.5,
  },
  selectionImage: {
    width: 14,
    height: 27,
  },
  selectionText: {
    fontSize: 34,
    color: "#9b9c9e",
    fontFamily: "HelveticaNeueLTPro-Hv",
  },
  menuText: {
    marginBottom: 23,
    fontSize: 14,
    color: "#9b9c9e",
    fontFamily: "HelveticaNeueLTPro-Hv",
    textAlign: "right",
  },
});

export default ContextSelector;
