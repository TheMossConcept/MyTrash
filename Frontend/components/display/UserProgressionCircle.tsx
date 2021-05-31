import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ProgressWheel from "react-native-progress-wheel";
import Subheader from "../styled/Subheader";
import InformationText from "../styled/InformationText";
import useAxiosConfig from "../../hooks/useAxiosConfig";

type Props = { userId: string; clusterId: string };

const UserProgressionCircle: FC<Props> = ({ userId, clusterId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [collectionProgress, setCollectionProgress] = useState<
    number | undefined
  >();
  const sharedAxiosConfig = useAxiosConfig();

  useEffect(() => {
    setIsLoading(true);

    axios
      .get("/GetUserProgressData", {
        params: { userId, clusterId },
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        const {
          rectifiedCollectionAmount,
          collectionGoal,
        } = data as ProgressionData;

        const collectedPercentage =
          (rectifiedCollectionAmount / collectionGoal) * 100;
        setCollectionProgress(collectedPercentage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId, clusterId, sharedAxiosConfig]);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={{ alignItems: "center" }}>
      <Subheader>Estimeret indsamlingsfremgang</Subheader>
      {collectionProgress ? (
        <ProgressWheel
          progress={collectionProgress}
          animateFromValue={0}
          duration={3000}
        />
      ) : (
        <InformationText>Kunne ikke hentes</InformationText>
      )}
    </View>
  );
};

type ProgressionData = {
  rectifiedCollectionAmount: number;
  collectionGoal: number;
};

export default UserProgressionCircle;
