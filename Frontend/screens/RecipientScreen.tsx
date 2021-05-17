import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState, useEffect, useCallback, useContext } from "react";
import { Button, View } from "react-native";
import sortCollectionsByStatus from "../utils/plasticCollections";
import axiosUtils from "../utils/axios";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";

import useAccessToken from "../hooks/useAccessToken";
import { TabsParamList } from "../typings/types";
import CreateBatch from "../components/batch/CreateBatch";
import BatchDetails, { Batch } from "../components/batch/BatchDetails";
import sortBatchByStatus from "../utils/batch";
import RegisterPlasticCollectionReciept from "../components/collection/RegisterPlasticCollectionReciept";
import Container from "../components/shared/Container";
import CategoryHeadline from "../components/styled/CategoryHeadline";
import { GlobalSnackbarContext } from "../navigation/TabNavigator";

type Props = StackScreenProps<TabsParamList, "Modtagelse">;

const RecipientScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const accessToken = useAccessToken();

  const fetchPlasticCollections = useCallback(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { recipientPartnerId: userId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [accessToken, userId]);

  useEffect(() => {
    fetchPlasticCollections();
  }, [fetchPlasticCollections]);

  const fetchBatches = useCallback(() => {
    axios
      .get("/GetBatches", {
        params: { recipientPartnerId: userId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setBatches(data);
      });
  }, [accessToken, userId]);

  // Initial fetch
  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);
  const sortedBatches = sortBatchByStatus(batches);

  return (
    <Container>
      <PlasticCollectionsDetails
        title="Modtaget"
        plasticCollections={sortedCollections.delivered}
        hideWeight
      >
        {(collection) => (
          <RegisterPlasticCollectionReciept
            plasticCollection={collection}
            successCallback={fetchPlasticCollections}
          />
        )}
      </PlasticCollectionsDetails>
      <PlasticCollectionsDetails
        title="Bekræftet"
        plasticCollections={sortedCollections.received}
      />
      <CategoryHeadline>Batches</CategoryHeadline>
      <CreateBatch batchCreatorId={userId} creationCallback={fetchBatches} />
      <BatchDetails batches={sortedBatches.created} title="Oprettede">
        {(batch) => (
          <RegisterBatchSent
            batchId={batch.id}
            successCallback={fetchBatches}
          />
        )}
      </BatchDetails>
      <BatchDetails batches={sortedBatches.sent} title="Afsendte" />
      <BatchDetails batches={sortedBatches.received} title="Modtaget" />
    </Container>
  );
};

type RegisterBatchSentProps = {
  batchId: string;
  successCallback: () => void;
};

const RegisterBatchSent: FC<RegisterBatchSentProps> = ({
  batchId,
  successCallback,
}) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const accessToken = useAccessToken();

  const markBatchAsSent = () => {
    axios
      .post(
        "/RegisterBatchSent",
        {},
        { ...axiosUtils.getSharedAxiosConfig(accessToken), params: { batchId } }
      )
      .then(() => {
        showGlobalSnackbar("Afsendelse registreret");
        successCallback();
      });
  };
  return (
    <View>
      <Button title="Marker som afsendt" onPress={markBatchAsSent} />
    </View>
  );
};

export default RecipientScreen;
