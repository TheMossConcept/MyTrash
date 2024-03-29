import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { View } from "react-native";
import ClusterList, { Cluster } from "../components/cluster/ClusterList";

import { TabsParamList } from "../typings/types";
import Container from "../components/shared/Container";
import { UpdateCluster } from "../components/cluster/ModifyCluster";
import useQueriedData from "../hooks/useQueriedData";
import LoadingIndicator from "../components/styled/LoadingIndicator";
import CollectorFormWithList from "../components/user/CollectorFormWithList";

type Props = StackScreenProps<TabsParamList, "Indsamlingsadministration">;

const CollectionAdministrationScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const {
    data: clusters,
    refetch: refetchClusters,
    isLoading,
  } = useQueriedData<Cluster[]>("/GetClusters", {
    collectionAdministratorId: userId,
  });

  return (
    <Container style={{ justifyContent: "flex-start" }}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <ClusterList clusters={clusters || []}>
          {({ cluster }) => (
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: 23 }}>
                <UpdateCluster
                  clusterId={cluster.id}
                  successCallback={refetchClusters}
                />
              </View>
              <CollectorFormWithList
                clusterId={cluster.id}
                title="Tilføj indsamler"
              />
            </View>
          )}
        </ClusterList>
      )}
    </Container>
  );
};

export default CollectionAdministrationScreen;
