import { StackScreenProps } from "@react-navigation/stack";
import { EventRegister } from "react-native-event-listeners";
import React, { FC } from "react";

import { TabsParamList } from "../typings/types";
import ClusterList from "../components/shared/ClusterList";
import useClusters from "../hooks/useCluster";
import Container from "../components/shared/Container";
import {
  CreateCluster,
  UpdateCluster,
} from "../components/forms/ModifyCluster";
import CollaboratorForm from "../components/forms/CollaboratorForm";
import CategoryHeadline from "../components/styled/CategoryHeadline";
import CollectorForm from "../components/forms/CollectorForm";

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const { clusters, refetchClusters } = useClusters();
  // TODO: Find types for this library and make sure all the events are strongly typed!!
  const handlePartnerInvited = () => EventRegister.emit("partnerInvited");

  return (
    <Container>
      <CategoryHeadline>INVITER PARTNER</CategoryHeadline>
      <CollaboratorForm
        submitTitle="Inviter partner"
        successCallback={handlePartnerInvited}
      />
      <CategoryHeadline>OPRET CLUSTER</CategoryHeadline>
      <CreateCluster successCallback={refetchClusters} />
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <Container>
            <CategoryHeadline>REDIGER CLUSTER</CategoryHeadline>
            <UpdateCluster
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
    </Container>
  );
};

export default AdministrationScreen;
