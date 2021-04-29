import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import axiosUtils from "../utils/axios";
import CollectionForm, {
  CollectionFormData,
} from "../components/forms/OrderCollectionForm";
import ClusterList from "../components/shared/ClusterList";
import useAccessToken from "../hooks/useAccessToken";
import useClusters from "../hooks/useCluster";
import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collections/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import OrderCollectionButton from "../components/collections/OrderCollectionButton";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

const CollectionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [
    collectionFormData,
    setCollectionFormData,
  ] = useState<CollectionFormData>({});
  const clusters = useClusters({ collectorId: userId });

  return (
    <View style={styles.container}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <View>
            <CollectionForm
              collectionFormState={[collectionFormData, setCollectionFormData]}
            />
            <OrderCollectionButton
              clusterId={cluster.id}
              userId={userId}
              collectionFormData={collectionFormData}
            />
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
      />
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
