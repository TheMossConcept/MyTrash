import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { Text } from "react-native";

import { View } from "../components/Themed";
import UserInvitationForm from "../components/UserInvitation";
import { TabsParamList } from "../typings/types";
import ClusterList from "../components/shared/ClusterList";
import useClusters from "../hooks/useCluster";
import Container from "../components/shared/Container";
import {
  CreateCluster,
  UpdateCluster,
} from "../components/forms/CreateClusterForm";

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const { clusters, refetchClusters } = useClusters();

  return (
    <Container>
      <CreateCluster successCallback={refetchClusters} />
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <View>
            <UpdateCluster
              clusterId={cluster.id}
              successCallback={refetchClusters}
            />
            <Text>Inviter bruger</Text>
            <UserInvitationForm clusterId={cluster.id} />
          </View>
        )}
      </ClusterList>
    </Container>
  );
};

export default AdministrationScreen;
