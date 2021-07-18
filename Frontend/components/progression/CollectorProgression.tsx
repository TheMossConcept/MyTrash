import React, { FC } from "react";
import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";
import useQueriedData from "../../hooks/useQueriedData";
import AppText from "../styled/AppText";
import ProgressionCircle, { ProgressionData } from "./ProgressionCircle";

type ClusterViewForCollectorProps = {
  userId: string;
  clusterId: string;
} & ViewProps;

const CollectorProgression: FC<ClusterViewForCollectorProps> = ({
  userId,
  clusterId,
  style,
  ...viewProps
}) => {
  const { data: userProgressData, isLoading: userProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetUserProgressData", {
      userId,
      clusterId,
    });
  const { data: clusterProgressData, isLoading: clusterProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetClusterProgressData", {
      clusterId,
    });

  return (
    <View style={style} {...viewProps}>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {/* eslint-disable no-nested-ternary */}
        {userProgressDataIsLoading ? (
          <View style={{ flex: 1 }}>
            <ActivityIndicator />
          </View>
        ) : userProgressData ? (
          <ProgressionCircle
            progressData={userProgressData}
            explanationText="YOUR SHARE"
          />
        ) : null}
        {clusterProgressDataIsLoading ? (
          <ActivityIndicator />
        ) : clusterProgressData ? (
          <ProgressionCircle
            progressData={clusterProgressData}
            explanationText="TOTAL SHARE"
          />
        ) : null}
        {/* eslint-enable no-nested-ternary */}
      </View>
      <View style={styles.textContainer}>
        <AppText
          text="You have already collected dia volut et
          vel is sandanimus coreptur."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 70,
  },
});

export default CollectorProgression;