import { StackScreenProps } from "@react-navigation/stack";
import { EventRegister } from "react-native-event-listeners";
import React, { FC } from "react";

import { View } from "react-native";
import { TabsParamList } from "../typings/types";
import ClusterList, { Cluster } from "../components/cluster/ClusterList";
import Container from "../components/shared/Container";
import {
  CloseClusterBtn,
  CreateCluster,
  UpdateCluster,
} from "../components/cluster/ModifyCluster";
import CollaboratorForm from "../components/user/CollaboratorForm";
import CollectorForm from "../components/user/CollectorForm";
import ClusterForm, {
  ClusterFormData,
} from "../components/cluster/ClusterForm";
import CollectorList from "../components/user/CollectorList";
import HeadlineText from "../components/styled/HeadlineText";
import useQueriedData from "../hooks/useQueriedData";
import LoadingIndicator from "../components/styled/LoadingIndicator";

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
      <View style={{ flexDirection: "row", marginBottom: 50 }}>
        <View style={{ flex: 1, marginRight: 50 }}>
          <CollaboratorForm
            title="Inviter partner"
            successCallback={handlePartnerInvited}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CreateCluster successCallback={refetchClusters} />
        </View>
      </View>
      <HeadlineText
        text="Aktive clustre."
        style={{ alignItems: "flex-start" }}
      />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ClusterList clusters={activeClusters}>
          {({ cluster }) => (
            <View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1, marginRight: 23 }}>
                  <UpdateCluster
                    clusterId={cluster.id}
                    successCallback={refetchClusters}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <HeadlineText
                    text="Inviter indsamler."
                    style={{ alignItems: "flex-start" }}
                  />
                  <CollectorForm
                    clusterId={cluster.id}
                    title="Tilføj indsamler"
                    style={{ marginBottom: 23 }}
                  />
                  <CollectorList clusterId={cluster.id} />
                </View>
              </View>
              <CloseClusterBtn
                clusterId={cluster.id}
                successCallback={refetchClusters}
                style={{ marginTop: 23 }}
              />
            </View>
          )}
        </ClusterList>
      )}
      <HeadlineText
        text="Lukkede clustre."
        style={{ alignItems: "flex-start" }}
      />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ClusterList clusters={inactiveClusters}>
          {({ cluster }) => <ClusterForm cluster={cluster} />}
        </ClusterList>
      )}
    </Container>
  );
};

export default AdministrationScreen;
