import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { ProgressBar } from "react-native-paper";
import { Text } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import Container from "../shared/Container";

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

        const collectedPercentage = rectifiedCollectionAmount / collectionGoal;
        setCollectionProgress(collectedPercentage);
      });
  }, [userId, clusterId, accessToken]);

  return (
    <Container>
      <Text>Estimeret indsamlingsfremgang</Text>
      {collectionProgress ? (
        <ProgressBar progress={collectionProgress} />
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
