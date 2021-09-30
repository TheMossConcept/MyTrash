import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useState } from "react";
import { View, StyleSheet, Linking } from "react-native";
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
import HoueLogo from "../components/styled/HoueLogo";
import LoadingIndicator from "../components/styled/LoadingIndicator";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

type FullCluster = Cluster & ClusterFormData;

const CollectionScreen: FC<Props> = ({ route }) => {
  const openMyTrashInfo = () => {
    Linking.openURL("https://www.houe.com/media/MyTrash_info.pdf");
  };
  const openProductsInfo = () => {
    Linking.openURL("https://www.houe.com/media/MyTrash_produkter.pdf");
  };

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
  return !activeCluster && isLoading ? (
    <Container style={styles.centered}>
      <LoadingIndicator />
    </Container>
  ) : activeCluster ? (
    <Container>
      <MainContentArea containerStyle={styles.mainContentAreaContainer}>
        <Menu />
        <HoueLogo />
        {isLoading && (
          <View style={styles.centered}>
            <LoadingIndicator />
          </View>
        )}
        {statusSelected ? (
          <CollectorProgression
            userId={userId}
            clusterId={activeCluster.id}
            clusterIsOpen={activeCluster.open}
            style={styles.collectorProgression}
          />
        ) : (
          <CollectionForm userId={userId} clusterId={activeCluster.id} />
        )}
      </MainContentArea>
      <BottomButtonContainer style={styles.bottomButtonContainer}>
        <View style={styles.firstButtonContainer}>
          <MobileButton
            text={`Status \n indsamling`}
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
            style={[styles.topButton, styles.bottomButton]}
          />
          <MobileButton
            text="MyTrash info"
            onPress={openMyTrashInfo}
            icon={{
              src: require("../assets/icons/leaf_grey.png"),
              width: 20.5,
              height: 32.5,
            }}
            style={styles.bottomButton}
            isVerticalButton
          />
        </View>
        <View style={styles.secondButtonContainer}>
          <MobileButton
            text={`Afhentning \n plastik`}
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
            style={[styles.topButton, styles.bottomButton]}
          />
          <MobileButton
            text="Produkter"
            style={styles.bottomButton}
            onPress={openProductsInfo}
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
    <MainContentArea>
      <Menu />
      <HoueLogo />
      <Container style={styles.centered}>
        <HeadlineText text="Ingen aktive clustre" />
      </Container>
    </MainContentArea>
  );
  /* eslint-enable no-nested-ternary */
};

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  mainContentAreaContainer: {
    height: "80%",
  },
  collectorProgression: { marginTop: 72.5 },
  bottomButtonContainer: {
    paddingVertical: 10,
    height: "20%",
  },
  firstButtonContainer: { flex: 1, paddingHorizontal: 7 },
  secondButtonContainer: { flex: 1 },
  topButton: { marginBottom: 9 },
  bottomButton: { height: "40%" },
});

export default CollectionScreen;
