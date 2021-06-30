import React, { FC } from "react";
import { ActivityIndicator, View } from "react-native";
import ProgressWheel from "react-native-progress-wheel";
import Subheader from "../styled/Subheader";
import InformationText from "../styled/InformationText";

type Props = {
  progressData: ProgressionData;
  isLoading: boolean;
  headline?: string;
};

// TODO: Move isLoading outside of this!
const UserProgressionCircle: FC<Props> = ({
  progressData,
  isLoading,
  headline,
}) => {
  const { rectifiedCollectionAmount, collectionGoal } = progressData;

  const collectedPercentage =
    (rectifiedCollectionAmount / collectionGoal) * 100;

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={{ alignItems: "center" }}>
      <Subheader>{headline || "Estimeret indsamlingsfremgang"}</Subheader>
      {collectedPercentage !== undefined ? (
        <ProgressWheel
          progress={collectedPercentage}
          animateFromValue={0}
          duration={3000}
        />
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
