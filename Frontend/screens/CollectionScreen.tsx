import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { DateTime } from "luxon";
import CollectionForm from "../components/collection/OrderCollectionForm";
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
import BottomButtonContainer from "../components/styled/BottomButtonContainer";
import StyledButton from "../components/styled/Button";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

const CollectionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;

  const { clusters } = useClusters({ collectorId: userId });
  const activeClusters = useMemo(
    () => clusters.filter((cluster) => !cluster.closedForCollection),
    [clusters]
  );

  // For now, it is an invariant that a collector can only ever be associated with
  // on active cluster at a time
  const activeCluster =
    activeClusters.length > 0 ? activeClusters[0] : undefined;

  return activeCluster ? (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/backgrond.png")}
        style={{ flex: 85, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Test</Text>
      </ImageBackground>
      <BottomButtonContainer style={{ paddingVertical: 20 }}>
        <View style={{ flex: 1, paddingHorizontal: 7 }}>
          <StyledButton
            text={`Status \n indsamling.`}
            icon={{
              src: require("../assets/icons/graph_grey.png"),
              width: 36,
              height: 26.5,
            }}
            isVerticalButton
            style={{
              marginBottom: 9,
            }}
          />
          <StyledButton
            text="Projekt."
            icon={{
              src: require("../assets/icons/leaf_grey.png"),
              width: 20.5,
              height: 32.5,
            }}
            isVerticalButton
          />
        </View>
        <View style={{ flex: 1 }}>
          <StyledButton
            text={`Afhentning \n plastik.`}
            icon={{
              src: require("../assets/icons/truck_grey.png"),
              width: 44,
              height: 25,
            }}
            isVerticalButton
            style={{
              marginBottom: 9,
            }}
          />
          <StyledButton
            text="Produkter."
            icon={{
              src: require("../assets/icons/chair_grey.png"),
              width: 19.5,
              height: 29,
            }}
            isVerticalButton
          />
        </View>
      </BottomButtonContainer>
    </View>
  ) : (
    <Text>Ingen aktive clustere</Text>
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

  const { data: userProgressData, isLoading: userProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetUserProgressData", {
      userId,
      clusterId,
    });
  const { data: clusterProgressData, isLoading: clusterProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetClusterProgressData", {
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});

export default CollectionScreen;
