import React, { FC } from "react";
import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";
import useQueriedData from "../../hooks/useQueriedData";
import AppText from "../styled/AppText";
import ProgressionCircle, { ProgressionData } from "./ProgressionCircle";

type ClusterViewForCollectorProps = {
  userId: string;
  clusterId: string;
  clusterIsOpen: boolean;
} & ViewProps;

const CollectorProgression: FC<ClusterViewForCollectorProps> = ({
  userId,
  clusterId,
  style,
  clusterIsOpen,
  ...viewProps
}) => {
  const { data: userProgressData, isLoading: userProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetUserProgressData", {
      userId,
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
        {!clusterIsOpen && <ClusterProgression clusterId={clusterId} />}
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
        {/* eslint-enable no-nested-ternary */}
      </View>
      <View style={styles.textContainer}>
        <AppText text="Status på din personlige indsamling samt dit clusters totale status." />
      </View>
    </View>
  );
};

type ClusterProgressionProps = Pick<ClusterViewForCollectorProps, "clusterId">;

const ClusterProgression: FC<ClusterProgressionProps> = ({ clusterId }) => {
  const { data: clusterProgressData, isLoading: clusterProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetClusterProgressData", {
      clusterId,
    });

  /* eslint-disable no-nested-ternary */
  return clusterProgressDataIsLoading ? (
    <View style={{ flex: 1 }}>
      <ActivityIndicator />
    </View>
  ) : clusterProgressData ? (
    <ProgressionCircle
      progressData={clusterProgressData}
      explanationText="Cluster."
    />
  ) : null;
  /* eslint-enable no-nested-ternary */
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 70,
  },
});

export default CollectorProgression;
