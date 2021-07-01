import React, { FC } from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import ProgressWheel from "react-native-progress-wheel";
import InformationText from "../styled/InformationText";

type Props = {
  explanationText: string;
  progressData: ProgressionData;
} & ViewProps;

// TODO: Move isLoading outside of this!
const UserProgressionCircle: FC<Props> = ({
  progressData,
  style,
  explanationText,
  ...viewProps
}) => {
  const { rectifiedCollectionAmount, collectionGoal } = progressData;

  const collectedPercentage =
    (rectifiedCollectionAmount / collectionGoal) * 100;

  return (
    <View style={[{ flex: 1 }, style]} {...viewProps}>
      {collectedPercentage !== undefined ? (
        <View>
          <Text style={styles.numberText}>
            {collectedPercentage <= 9
              ? `0${collectedPercentage}`
              : collectedPercentage}
          </Text>
          <Text style={styles.percentageText}>%</Text>
          <Text style={styles.explanationText}>{explanationText}</Text>
          <ProgressWheel
            progress={collectedPercentage}
            animateFromValue={0}
            width={3}
            size={140}
            color="#748c43"
            backgroundColor="#ffffff"
            duration={3000}
          />
        </View>
      ) : (
        <InformationText>Kunne ikke hentes</InformationText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  numberText: {
    position: "absolute",
    top: 35,
    left: 35,
    fontSize: 60,
    color: "#b0bd78",
    fontFamily: "AvantGarde-Medium",
  },
  percentageText: {
    position: "absolute",
    top: 50,
    left: 105,
    fontSize: 15,
    color: "#748c43",
    fontFamily: "AvantGarde-Medium",
  },
  explanationText: {
    position: "absolute",
    top: 100,
    left: 35,
    fontFamily: "AvantGarde-Medium",
    fontSize: 15,
    color: "#ffffff",
  },
});

export type ProgressionData = {
  rectifiedCollectionAmount: number;
  collectionGoal: number;
};

export default UserProgressionCircle;
