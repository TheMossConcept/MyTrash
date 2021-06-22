import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState, useMemo } from "react";
import { View, Text } from "react-native";
import { DateTime } from "luxon";
import CollectionForm from "../components/collection/OrderCollectionForm";
import ClusterList from "../components/cluster/ClusterList";
import useClusters from "../hooks/useClusters";
import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import Container from "../components/shared/Container";
import ProgressionCircle, {
  ProgressionData,
} from "../components/shared/ProgressionCircle";
import useAxiosConfig from "../hooks/useAxiosConfig";
import useQueriedData from "../hooks/useQueriedData";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

const CollectionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;

  const { clusters } = useClusters({ collectorId: userId });
  const activeClusters = useMemo(
    () => clusters.filter((cluster) => !cluster.closedForCollection),
    [clusters]
  );

  return (
    <Container style={{ justifyContent: "center" }}>
      <ClusterList clusters={activeClusters}>
        {({ cluster }) => (
          <ClusterViewForCollector userId={userId} clusterId={cluster.id} />
        )}
      </ClusterList>
    </Container>
  );
};

type ClusterViewForCollectorProps = {
  userId: string;
  clusterId: string;
};

const ClusterViewForCollector: FC<ClusterViewForCollectorProps> = ({
  userId,
  clusterId,
}) => {
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  // TODO: Move this to useQueriedData
  const sharedAxiosConfig = useAxiosConfig();
  const fetchPlasticCollections = useCallback(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { collectorId: userId, clusterId },
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [sharedAxiosConfig, userId]);

  useEffect(() => {
    fetchPlasticCollections();
  }, [fetchPlasticCollections]);

  const {
    data: userProgressData,
    isLoading: userProgressDataIsLoading,
  } = useQueriedData<ProgressionData>("/GetUserProgressData", {
    userId,
    clusterId,
  });
  const {
    data: clusterProgressData,
    isLoading: clusterProgressDataIsLoading,
  } = useQueriedData<ProgressionData>("/GetClusterProgressData", {
    clusterId,
  });

  return (
    <View>
      {userProgressData ? (
        <ProgressionCircle
          headline="Personlig indsamlingsfremgang"
          progressData={userProgressData}
          isLoading={userProgressDataIsLoading}
        />
      ) : null}
      {clusterProgressData ? (
        <ProgressionCircle
          headline="Cirklens samlede indsamlingsfremgang"
          progressData={clusterProgressData}
          isLoading={clusterProgressDataIsLoading}
        />
      ) : null}
      <CollectionForm
        clusterId={clusterId}
        userId={userId}
        successCallback={fetchPlasticCollections}
      />
      {plasticCollections && (
        <UserCollectionsForCluster plasticCollections={plasticCollections} />
      )}
    </View>
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
