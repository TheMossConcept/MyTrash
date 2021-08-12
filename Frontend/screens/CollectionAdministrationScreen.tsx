import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { View } from "react-native";
import ClusterList, { Cluster } from "../components/cluster/ClusterList";

import { TabsParamList } from "../typings/types";
import Container from "../components/shared/Container";
import { UpdateCluster } from "../components/cluster/ModifyCluster";
import CollectorForm from "../components/user/CollectorForm";
import useQueriedData from "../hooks/useQueriedData";
import LoadingIndicator from "../components/styled/LoadingIndicator";
import HeadlineText from "../components/styled/HeadlineText";
import CollectorList from "../components/user/CollectorList";

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

  const addCollectorTitle = "Tilføj indsamler.";

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
              <View style={{ flex: 1 }}>
                <HeadlineText
                  text={addCollectorTitle}
                  style={{ alignItems: "flex-start" }}
                />
                <CollectorForm
                  clusterId={cluster.id}
                  title={addCollectorTitle}
                />
                <CollectorList clusterId={cluster.id} />
              </View>
            </View>
          )}
        </ClusterList>
      )}
    </Container>
  );
};

export default CollectionAdministrationScreen;
