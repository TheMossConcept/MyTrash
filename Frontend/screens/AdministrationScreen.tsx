import { StackScreenProps } from "@react-navigation/stack";
import { EventRegister } from "react-native-event-listeners";
import React, { FC } from "react";

import { StyleSheet, View } from "react-native";
import { TabsParamList } from "../typings/types";
import ClusterList, { Cluster } from "../components/cluster/ClusterList";
import Container from "../components/shared/Container";
import {
  CloseClusterBtn,
  CreateCluster,
  UpdateCluster,
} from "../components/cluster/ModifyCluster";
import CollaboratorForm from "../components/user/CollaboratorForm";
import ClusterForm, {
  ClusterFormData,
} from "../components/cluster/ClusterForm";
import HeadlineText from "../components/styled/HeadlineText";
import useQueriedData from "../hooks/useQueriedData";
import LoadingIndicator from "../components/styled/LoadingIndicator";
import CollectorFormWithList from "../components/user/CollectorFormWithList";

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const {
    data: clusters,
    refetch: refetchClusters,
    isLoading,
  } = useQueriedData<Array<Cluster & ClusterFormData>>("/GetClusters");
  // TODO: Find types for this library and make sure all the events are strongly typed!!
  const handlePartnerInvited = () => EventRegister.emit("partnerInvited");

  const activeClusters = clusters
    ? clusters.filter((cluster) => !cluster.closedForCollection)
    : [];
  const inactiveClusters = clusters
    ? clusters.filter((cluster) => cluster.closedForCollection)
    : [];

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.collaboratorFormContainer}>
          <CollaboratorForm
            title="Inviter partner"
            successCallback={handlePartnerInvited}
          />
        </View>
        <View style={styles.createClusterContainer}>
          <CreateCluster successCallback={refetchClusters} />
        </View>
      </View>
      <HeadlineText text="Aktive clustre." style={styles.headlineText} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ClusterList clusters={activeClusters}>
          {({ cluster }) => (
            <View>
              <View style={styles.activeClustersContainer}>
                <View style={styles.updateClusterContainer}>
                  <UpdateCluster
                    clusterId={cluster.id}
                    successCallback={refetchClusters}
                  />
                </View>
                <CollectorFormWithList
                  clusterId={cluster.id}
                  title="Tilføj indsamler."
                />
              </View>
              <CloseClusterBtn
                clusterId={cluster.id}
                successCallback={refetchClusters}
                style={styles.closeClusterButton}
              />
            </View>
          )}
        </ClusterList>
      )}
      <HeadlineText text="Lukkede clustre." style={styles.headlineText} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ClusterList clusters={inactiveClusters}>
          {({ cluster }) => <ClusterForm cluster={cluster} title="Cluster" />}
        </ClusterList>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", marginBottom: 50 },
  collaboratorFormContainer: { flex: 1, marginRight: 50 },
  createClusterContainer: { flex: 1 },
  activeClustersContainer: { flexDirection: "row" },
  updateClusterContainer: { flex: 1, marginRight: 23 },
  headlineText: { alignItems: "flex-start" },
  closeClusterButton: { marginTop: 23 },
});

export default AdministrationScreen;
