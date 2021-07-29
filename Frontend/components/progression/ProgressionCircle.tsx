import React, { FC } from "react";
import { View, ViewProps, Text, StyleSheet } from "react-native";
import ProgressWheel from "react-native-progress-wheel";
import HeadlineText from "../styled/HeadlineText";

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

  // It does not ever make sense to show decimals or percentages larger than
  // 100 or less than 0 to the user
  const collectedPercentageRectified = Math.max(
    Math.min(Math.round(collectedPercentage), 100),
    0
  );

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {collectedPercentage !== undefined ? (
        <View>
          <Text
            // TODO: Consider a way to make this conditional styling nicer!
            style={[
              styles.numberText,
              collectedPercentageRectified === 100 && { left: 2.5 },
            ]}
          >
            {collectedPercentage < 10
              ? `0${collectedPercentageRectified}`
              : collectedPercentageRectified}
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
        <HeadlineText text="Kunne ikke hentes" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
