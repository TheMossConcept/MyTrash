import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";

import { TabsParamList } from "../typings/types";
import ClusterList from "../components/shared/ClusterList";
import useClusters from "../hooks/useCluster";
import Container from "../components/shared/Container";
import {
  CreateCluster,
  UpdateCluster,
} from "../components/forms/ModifyCluster";
import UserForm from "../components/forms/UserForm";
import CategoryHeadline from "../components/styled/CategoryHeadline";

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const { clusters, refetchClusters } = useClusters();

  return (
    <Container>
      <CategoryHeadline>Inviter partner</CategoryHeadline>
      <UserForm submitTitle="Inviter partner" isPartner />
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
