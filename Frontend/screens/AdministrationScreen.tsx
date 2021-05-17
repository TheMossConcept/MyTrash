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

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const { clusters, refetchClusters } = useClusters();
  // TODO: Find types for this library and make sure all the events are strongly typed!!
  const handlePartnerInvited = () => EventRegister.emit("partnerInvited");

  return (
    <Container>
      <CategoryHeadline>Inviter partner</CategoryHeadline>
      <CollaboratorForm
        submitTitle="Inviter partner"
        successCallback={handlePartnerInvited}
      />
      <CategoryHeadline>Opret cluster</CategoryHeadline>
      <CreateCluster successCallback={refetchClusters} />
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <Container>
            <UpdateCluster
              clusterId={cluster.id}
              successCallback={refetchClusters}
            />
          </Container>
        )}
      </ClusterList>
    </Container>
  );
};

export default AdministrationScreen;
