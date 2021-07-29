import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { TabsParamList } from "../typings/types";
import BottomButtonContainer from "../components/styled/BottomButtonContainer";
import MobileButton from "../components/styled/MobileButton";
import MainContentArea from "../components/styled/MainContentArea";
import Menu from "../components/shared/Menu";
import HeadlineText from "../components/styled/HeadlineText";
import CollectorProgression from "../components/progression/CollectorProgression";
import useQueriedData from "../hooks/useQueriedData";
import { Cluster } from "../components/cluster/ClusterList";
import { ClusterFormData } from "../components/cluster/ClusterForm";
import CollectionForm from "../components/collection/OrderCollectionForm";
import Container from "../components/shared/Container";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

type FullCluster = Cluster & ClusterFormData;

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
    <Container style={styles.centered}>
      <ActivityIndicator />
    </Container>
  ) : activeCluster ? (
    <Container>
      <MainContentArea containerStyle={{ height: "80%" }}>
        <ScrollView>
          <Menu />
          <HeadlineText style={{ marginTop: 54 }} />
          {statusSelected ? (
            <CollectorProgression
              userId={userId}
              clusterId={activeCluster.id}
              style={{ marginTop: 62.5 }}
            />
          ) : (
            <CollectionForm userId={userId} clusterId={activeCluster.id} />
          )}
        </ScrollView>
      </MainContentArea>
      <BottomButtonContainer
        style={{ paddingVertical: 20, height: "20%", minHeight: 165 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 7 }}>
          <MobileButton
            text={`Status \n indsamling.`}
            icon={{
              src: statusSelected
                ? require("../assets/icons/graph_green.png")
                : require("../assets/icons/graph_grey.png"),
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
          <MobileButton
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
          <MobileButton
            text={`Afhentning \n plastik.`}
            icon={{
              src: collectionSelected
                ? require("../assets/icons/truck_green.png")
                : require("../assets/icons/truck_grey.png"),
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
          <MobileButton
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
    </Container>
  ) : (
    <Container style={styles.centered}>
      <HeadlineText text="Ingen aktive clustere" />
    </Container>
  );
  /* eslint-enable no-nested-ternary */
};

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CollectionScreen;
