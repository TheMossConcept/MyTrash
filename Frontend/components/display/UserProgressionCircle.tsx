import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import ProgressWheel from "react-native-progress-wheel";
import { Text, View } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import Container from "../shared/Container";
import Subheader from "../styled/Subheader";

type Props = { userId: string; clusterId: string };

const UserProgressionCircle: FC<Props> = ({ userId, clusterId }) => {
  const [collectionProgress, setCollectionProgress] = useState<
    number | undefined
  >();
  const accessToken = useAccessToken();

  useEffect(() => {
    axios
      .get("/GetUserProgressData", {
        params: { userId, clusterId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
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
      });
  }, [userId, clusterId, accessToken]);

  return (
    <Container>
      <Subheader>Estimeret indsamlingsfremgang</Subheader>
      {collectionProgress ? (
        <ProgressWheel
          progress={collectionProgress}
          animateFromValue={0}
          duration={3000}
        />
      ) : (
        "Ukendt"
      )}
    </Container>
  );
};

type ProgressionData = {
  rectifiedCollectionAmount: number;
  collectionGoal: number;
};

export default UserProgressionCircle;
