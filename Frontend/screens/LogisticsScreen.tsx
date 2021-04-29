import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import axiosUtils from "../utils/axios";

import useAccessToken from "../hooks/useAccessToken";
import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collections/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import SchedulePlasticCollection from "../components/collections/SchedulePlasticCollection";
import DeliverPlasticCollection from "../components/collections/CollectPlasticCollection";

type Props = StackScreenProps<TabsParamList, "Logistik">;

const LogisticsScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const accessToken = useAccessToken();

  useEffect(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { logisticsPartnerId: userId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [accessToken, userId]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);

  return (
    <View style={styles.container}>
      <PlasticCollectionsDetails
        title="Afventer"
        plasticCollections={sortedCollections.pending}
      >
        {(collectionId) => (
          <SchedulePlasticCollection plasticCollectionId={collectionId} />
        )}
      </PlasticCollectionsDetails>
      <PlasticCollectionsDetails
        title="Planlagt"
        plasticCollections={sortedCollections.scheduled}
      >
        {(collectionId) => (
          <DeliverPlasticCollection plasticCollectionId={collectionId} />
        )}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
  },
});

export default LogisticsScreen;
