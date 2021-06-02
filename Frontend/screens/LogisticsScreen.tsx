import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import SchedulePlasticCollection from "../components/collection/SchedulePlasticCollection";
import DeliverPlasticCollection from "../components/collection/DeliverPlasticCollection";
import Container from "../components/shared/Container";
import CategoryHeadline from "../components/styled/CategoryHeadline";
import InformationText from "../components/styled/InformationText";
import useAxiosConfig from "../hooks/useAxiosConfig";

type Props = StackScreenProps<TabsParamList, "Logistik">;

const LogisticsScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const sharedAxiosConfig = useAxiosConfig();

  const fetchPlasticCollections = useCallback(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { logisticsPartnerId: userId },
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [sharedAxiosConfig, userId]);

  // Do an initial plastic collections fetch
  useEffect(() => {
    fetchPlasticCollections();
  }, [fetchPlasticCollections]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);

  return (
    <Container style={{ padding: 25 }}>
      <CategoryHeadline>Plastindsamlinger</CategoryHeadline>
      <PlasticCollectionsDetails
        title="Afventer"
        plasticCollections={sortedCollections.pending}
      >
        {(collection) => (
          <View>
            {collection.isFirstCollection && (
              <InformationText>Dette er første opsamling</InformationText>
            )}
            {collection.isLastCollection && (
              <InformationText>Dette er sidste opsamling</InformationText>
            )}
            <SchedulePlasticCollection
              plasticCollectionId={collection.id}
              plasticCollectionScheduledCallback={fetchPlasticCollections}
            />
          </View>
        )}
      </PlasticCollectionsDetails>
      <PlasticCollectionsDetails
        title="Planlagt"
        plasticCollections={sortedCollections.scheduled}
      >
        {(collection) => (
          <DeliverPlasticCollection
            plasticCollectionId={collection.id}
            successCallback={fetchPlasticCollections}
          />
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
    </Container>
  );
};

export default LogisticsScreen;
