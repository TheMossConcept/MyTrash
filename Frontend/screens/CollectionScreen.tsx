import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
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

type Props = StackScreenProps<TabsParamList, "Indsamling">;

const CollectionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;

  const { clusters } = useClusters({ collectorId: userId });

  return (
    <View style={styles.container}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <View>
            <CollectionForm clusterId={cluster.id} userId={userId} />
            <UserCollectionsForCluster userId={userId} clusterId={cluster.id} />
          </View>
        )}
      </ClusterList>
    </View>
  );
};

type UserCollectionsForClusterProps = { userId: string; clusterId: string };

const UserCollectionsForCluster: FC<UserCollectionsForClusterProps> = ({
  userId,
  clusterId,
}) => {
  // TODO: Make this into a getPlasticCollections hook with an option for
  // grouping based on the status
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const accessToken = useAccessToken();

  useEffect(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { collectorId: userId, clusterId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [accessToken, clusterId, userId]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);
  return (
    <View>
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
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
