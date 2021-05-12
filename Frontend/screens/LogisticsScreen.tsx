import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";
import axiosUtils from "../utils/axios";

import useAccessToken from "../hooks/useAccessToken";
import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import SchedulePlasticCollection from "../components/collection/SchedulePlasticCollection";
import DeliverPlasticCollection from "../components/collection/DeliverPlasticCollection";
import Container from "../components/shared/Container";

type Props = StackScreenProps<TabsParamList, "Logistik">;

const LogisticsScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const accessToken = useAccessToken();

  const fetchPlasticCollections = useCallback(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { logisticsPartnerId: userId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [userId, accessToken]);

  // Do an initial plastic collections fetch
  useEffect(() => {
    fetchPlasticCollections();
  }, [fetchPlasticCollections]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);

  return (
    <Container style={{ padding: 25 }}>
      <PlasticCollectionsDetails
        title="Afventer"
        plasticCollections={sortedCollections.pending}
      >
        {(collection) => (
          <SchedulePlasticCollection
            plasticCollectionId={collection.id}
            plasticCollectionScheduledCallback={fetchPlasticCollections}
          />
        )}
      </PlasticCollectionsDetails>
      <PlasticCollectionsDetails
        title="Planlagt"
        plasticCollections={sortedCollections.scheduled}
      >
        {(collection) => (
          <DeliverPlasticCollection plasticCollectionId={collection.id} />
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
