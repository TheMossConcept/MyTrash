import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { Text } from "react-native";

import UserInvitationForm from "../components/UserInvitation";
import { TabsParamList } from "../typings/types";
import ClusterList from "../components/shared/ClusterList";
import useClusters from "../hooks/useCluster";
import Container from "../components/shared/Container";
import {
  CreateCluster,
  UpdateCluster,
} from "../components/forms/ModifyCluster";

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const { clusters, refetchClusters } = useClusters();

  return (
    <Container>
      <CreateCluster successCallback={refetchClusters} />
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <Container>
            <UpdateCluster
              clusterId={cluster.id}
              successCallback={refetchClusters}
            />
            <Text>Inviter bruger</Text>
            <UserInvitationForm clusterId={cluster.id} />
          </Container>
        )}
      </ClusterList>
    </Container>
  );
};

export default AdministrationScreen;
