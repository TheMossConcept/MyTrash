import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { DateTime } from "luxon";
import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import Container from "../components/shared/Container";
import BottomButtonContainer from "../components/styled/BottomButtonContainer";
import StyledButton from "../components/styled/Button";
import MainContentArea from "../components/styled/MainContentArea";
import Menu from "../components/shared/Menu";
import HeadlineText from "../components/styled/HeadlineText";
import CollectorProgression from "../components/progression/CollectorProgression";
import useQueriedData from "../hooks/useQueriedData";
import { Cluster } from "../components/cluster/ClusterList";
import { ClusterFormData } from "../components/cluster/ClusterForm";
import CollectionForm from "../components/collection/OrderCollectionForm";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

type FullCluster = Cluster & ClusterFormData;

const iconBasePath = "../assets/icons";

const CollectionScreen: FC<Props> = ({ route }) => {
  const [selectedScreen, setSelectedScreen] = useState<"status" | "collection">(
    "status"
  );
  const statusSelected = selectedScreen === "status";
  const collectionSelected = selectedScreen === "collection";

  const { userId } = route.params;

  const { data: clusters, isLoading } = useQueriedData<FullCluster[]>(
    "/GetClusters",
    {
      collectorId: userId,
    }
  );

  const activeClusters = clusters
    ? clusters.filter((cluster) => !cluster.closedForCollection)
    : [];

  // For now, it is an invariant that a collector can only ever be associated with
  // on active cluster at a time
  const activeCluster =
    activeClusters.length > 0 ? activeClusters[0] : undefined;

  /* eslint-disable no-nested-ternary */
  return isLoading ? (
    <View style={styles.fullScreenCentered}>
      <ActivityIndicator />
    </View>
  ) : activeCluster ? (
    <View style={styles.container}>
      <MainContentArea>
        <Menu />
        <HeadlineText style={{ marginTop: 54 }} />
        {statusSelected ? (
          <CollectorProgression
            userId={userId}
            clusterId={activeCluster.id}
            style={{ marginTop: 62.5 }}
          />
        ) : (
          <CollectionForm
            userId={userId}
            clusterId={activeCluster.id}
            successCallback={() => console.log("Not implemented yet!")}
          />
        )}
      </MainContentArea>
      <BottomButtonContainer style={{ paddingVertical: 20 }}>
        <View style={{ flex: 1, paddingHorizontal: 7 }}>
          <StyledButton
            text={`Status \n indsamling.`}
            icon={{
              src: statusSelected
                ? require(`${iconBasePath}/graph_green.png`)
                : require(`${iconBasePath}/graph_grey.png`),
              width: 36,
              height: 26.5,
            }}
            isVerticalButton
            isSelected={statusSelected}
            onPress={() => setSelectedScreen("status")}
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
              src: collectionSelected
                ? require(`${iconBasePath}/truck_green.png`)
                : require(`${iconBasePath}/truck_grey.png`),
              width: 44,
              height: 25,
            }}
            isVerticalButton
            isSelected={collectionSelected}
            onPress={() => setSelectedScreen("collection")}
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
    <View style={styles.fullScreenCentered}>
      <HeadlineText text="Ingen aktive clustere" />
    </View>
  );
  /* eslint-enable no-nested-ternary */
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
  fullScreenCentered: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CollectionScreen;
