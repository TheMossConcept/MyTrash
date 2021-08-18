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
  console.log("Rendering CollectorProgression");
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
            explanationText="Individuel."
          />
        ) : null}
        {clusterProgressDataIsLoading ? (
          <ActivityIndicator />
        ) : clusterProgressData ? (
          <ProgressionCircle
            progressData={clusterProgressData}
            explanationText="Cluster."
          />
        ) : null}
        {/* eslint-enable no-nested-ternary */}
      </View>
      <View style={styles.textContainer}>
        <AppText text="Status på din personlige indsamling samt dit clusters totale status." />
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
