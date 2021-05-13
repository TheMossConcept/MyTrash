import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState, useEffect, useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
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
import DismissableSnackbar from "../components/shared/DismissableSnackbar";

type Props = StackScreenProps<TabsParamList, "Modtagelse">;

const RecipientScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const accessToken = useAccessToken();
  useEffect(() => {
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
    <Container style={{ padding: 25 }}>
      <CategoryHeadline>Plastindsamlinger</CategoryHeadline>
      <PlasticCollectionsDetails
        title="Modtaget"
        plasticCollections={sortedCollections.delivered}
      >
        {(collection) => (
          <RegisterPlasticCollectionReciept plasticCollection={collection} />
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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const accessToken = useAccessToken();

  const markBatchAsSent = () => {
    axios
      .post(
        "/RegisterBatchSent",
        {},
        { ...axiosUtils.getSharedAxiosConfig(accessToken), params: { batchId } }
      )
      .then(() => {
        successCallback();
      });
  };
  return (
    <View>
      <Button title="Marker som afsendt" onPress={markBatchAsSent} />
      <DismissableSnackbar
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
        title="Afsendelse registreret"
      />
    </View>
  );
};

export default RecipientScreen;
