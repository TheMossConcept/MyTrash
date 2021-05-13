import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { DateTime } from "luxon";
import axiosUtils from "../utils/axios";
import CollectionForm from "../components/forms/OrderCollectionForm";
import ClusterList from "../components/shared/ClusterList";
import useAccessToken from "../hooks/useAccessToken";
import useClusters from "../hooks/useCluster";
import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import Container from "../components/shared/Container";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

const CollectionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;

  const { clusters } = useClusters({ collectorId: userId });

  const [plasticCollections, setPlasticCollections] = useState<
    { [clusterId: string]: PlasticCollection[] } | undefined
  >(undefined);

  const accessToken = useAccessToken();

  const fetchPlasticCollections = useCallback(
    (clusterId: string) => {
      axios
        .get("/GetPlasticCollections", {
          params: { collectorId: userId, clusterId },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((axiosResult) => {
          const { data } = axiosResult;
          setPlasticCollections((previousCollections) => ({
            ...previousCollections,
            [clusterId]: data,
          }));
        });
    },
    [accessToken, userId]
  );

  // Initial plasticCollections fetch
  useEffect(() => {
    const clusterIds = clusters.map((cluster) => cluster.id);
    console.log(clusterIds);
    clusterIds.forEach((clusterId) => fetchPlasticCollections(clusterId));
  }, [clusters, fetchPlasticCollections]);

  return (
    <Container style={{ justifyContent: "center" }}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => {
          const fetchPlasticCollectionsForCluster = () => {
            fetchPlasticCollections(cluster.id);
          };

          return (
            <View>
              <CollectionForm
                clusterId={cluster.id}
                userId={userId}
                successCallback={fetchPlasticCollectionsForCluster}
              />
              {plasticCollections && (
                <UserCollectionsForCluster
                  plasticCollections={plasticCollections[cluster.id]}
                />
              )}
            </View>
          );
        }}
      </ClusterList>
    </Container>
  );
};

type UserCollectionsForClusterProps = {
  plasticCollections: PlasticCollection[];
};

const UserCollectionsForCluster: FC<UserCollectionsForClusterProps> = ({
  plasticCollections,
}) => {
  // TODO: Make this into a getPlasticCollections hook with an option for
  // grouping based on the status

  const sortedCollections = sortCollectionsByStatus(plasticCollections);
  return (
    <Container>
      <PlasticCollectionsDetails
        title="Afventer"
        plasticCollections={sortedCollections.pending}
      />
      <PlasticCollectionsDetails
        title="Planlagt"
        plasticCollections={sortedCollections.scheduled}
      >
        {(collection) => {
          const scheduledPickupDateString = collection.scheduledPickupDate
            ? DateTime.fromISO(collection.scheduledPickupDate).toLocaleString({
                month: "long",
                day: "2-digit",
                minute: "2-digit",
                hour: "2-digit",
                hour12: false,
              })
            : undefined;

          if (scheduledPickupDateString !== undefined) {
            <Text>Afhentning planlagt til {scheduledPickupDateString}</Text>;
          }
          return null;
        }}
      </PlasticCollectionsDetails>
      <PlasticCollectionsDetails
        title="Afleveret"
        plasticCollections={sortedCollections.delivered}
      />
      <PlasticCollectionsDetails
        title="Bekræftet"
        plasticCollections={sortedCollections.received}
      />
    </Container>
  );
};

export default CollectionScreen;
