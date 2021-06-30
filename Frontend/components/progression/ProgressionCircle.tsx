import React, { FC } from "react";
import { ActivityIndicator, View, ViewProps, Text } from "react-native";
import ProgressWheel from "react-native-progress-wheel";
import InformationText from "../styled/InformationText";

type Props = {
  progressData: ProgressionData;
  isLoading: boolean;
} & ViewProps;

// TODO: Move isLoading outside of this!
const UserProgressionCircle: FC<Props> = ({
  progressData,
  isLoading,
  style,
  ...viewProps
}) => {
  const { rectifiedCollectionAmount, collectionGoal } = progressData;

  const collectedPercentage =
    (rectifiedCollectionAmount / collectionGoal) * 100;

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={[{ flex: 1 }, style]} {...viewProps}>
      {collectedPercentage !== undefined ? (
        <View>
          <Text
            style={{
              position: "absolute",
              top: 35,
              left: 35,
              fontSize: 60,
              color: "#b0bd78",
              fontFamily: "AvantGarde-Medium",
            }}
          >
            {collectedPercentage <= 9
              ? `0${collectedPercentage}`
              : collectedPercentage}
          </Text>
          <Text
            style={{
              position: "absolute",
              top: 50,
              left: 105,
              fontSize: 15,
              color: "#748c43",
              fontFamily: "AvantGarde-Medium",
            }}
          >
            %
          </Text>
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

export type ProgressionData = {
  rectifiedCollectionAmount: number;
  collectionGoal: number;
};

export default UserProgressionCircle;
