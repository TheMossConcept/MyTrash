import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { View } from "react-native";
import ClusterList from "../components/cluster/ClusterList";

import { TabsParamList } from "../typings/types";
import useClusters from "../hooks/useClusters";
import Container from "../components/shared/Container";
import { UpdateCluster } from "../components/cluster/ModifyCluster";
import CollectorForm from "../components/user/CollectorForm";
import HeadlineText from "../components/styled/HeadlineText";

type Props = StackScreenProps<TabsParamList, "Indsamlingsadministration">;

const CollectionAdministrationScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const { clusters, refetchClusters } = useClusters({
    collectionAdministratorId: userId,
  });

  return (
    <Container style={{ justifyContent: "flex-start" }}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, marginRight: 23 }}>
              <UpdateCluster
                clusterId={cluster.id}
                successCallback={refetchClusters}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CollectorForm clusterId={cluster.id} title="Tilføj indsamler" />
            </View>
          </View>
        )}
      </ClusterList>
    </Container>
  );
};

export default CollectionAdministrationScreen;
