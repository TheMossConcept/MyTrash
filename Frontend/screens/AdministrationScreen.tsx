import { StackScreenProps } from "@react-navigation/stack";
import { EventRegister } from "react-native-event-listeners";
import React, { FC } from "react";

import { TabsParamList } from "../typings/types";
import ClusterList from "../components/cluster/ClusterList";
import useClusters from "../hooks/useCluster";
import Container from "../components/shared/Container";
import {
  CloseClusterBtn,
  CreateCluster,
  UpdateCluster,
} from "../components/cluster/ModifyCluster";
import CollaboratorForm from "../components/user/CollaboratorForm";
import CategoryHeadline from "../components/styled/CategoryHeadline";
import CollectorForm from "../components/user/CollectorForm";
import ClusterForm from "../components/cluster/ClusterForm";

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const { clusters, refetchClusters } = useClusters();
  // TODO: Find types for this library and make sure all the events are strongly typed!!
  const handlePartnerInvited = () => EventRegister.emit("partnerInvited");

  const activeClusters = clusters.filter(
    (cluster) => !cluster.closedForCollection
  );
  const inactiveClusters = clusters.filter(
    (cluster) => cluster.closedForCollection
  );

  return (
    <Container>
      <CategoryHeadline>INVITER PARTNER</CategoryHeadline>
      <CollaboratorForm
        submitTitle="Inviter partner"
        successCallback={handlePartnerInvited}
      />
      <CategoryHeadline>OPRET CLUSTER</CategoryHeadline>
      <CreateCluster successCallback={refetchClusters} />
      <CategoryHeadline>AKTIVE CLUSTERE</CategoryHeadline>
      <ClusterList clusters={activeClusters}>
        {({ cluster }) => (
          <Container>
            <CategoryHeadline>REDIGER CLUSTER</CategoryHeadline>
            <UpdateCluster
              clusterId={cluster.id}
              successCallback={refetchClusters}
            />
            <CloseClusterBtn
              clusterId={cluster.id}
              successCallback={refetchClusters}
            />
            <CategoryHeadline>TILFØJ INDSAMLER</CategoryHeadline>
            <CollectorForm
              clusterId={cluster.id}
              submitTitle="Tilføj indsamler"
            />
          </Container>
        )}
      </ClusterList>
      <CategoryHeadline>LUKKEDE CLUSTRE</CategoryHeadline>
      <ClusterList
        clusters={inactiveClusters}
        showSingleClusterExpanded={false}
      >
        {({ cluster }) => <ClusterForm cluster={cluster} />}
      </ClusterList>
    </Container>
  );
};

export default AdministrationScreen;
