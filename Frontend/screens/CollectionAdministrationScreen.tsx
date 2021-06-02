import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import ClusterList from "../components/cluster/ClusterList";

import { TabsParamList } from "../typings/types";
import useClusters from "../hooks/useCluster";
import Container from "../components/shared/Container";
import { UpdateCluster } from "../components/cluster/ModifyCluster";
import CollectorForm from "../components/user/CollectorForm";

type Props = StackScreenProps<TabsParamList, "CollectionAdministration">;

const CollectionAdministrationScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const { clusters, refetchClusters } = useClusters({
    collectionAdministratorId: userId,
  });

  return (
    <Container style={{ justifyContent: "flex-start" }}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <Container>
            <UpdateCluster
              clusterId={cluster.id}
              successCallback={refetchClusters}
            />
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

export default CollectionAdministrationScreen;
