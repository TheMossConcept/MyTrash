import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState, useEffect } from "react";
import { Button, Text } from "react-native";
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

  useEffect(() => {
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

  const sortedCollections = sortCollectionsByStatus(plasticCollections);
  const sortedBatches = sortBatchByStatus(batches);

  return (
    <Container style={{ justifyContent: "center" }}>
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
      >
        {(collection) => {
          // TODO: Change this such that it is a high level operation and you can select a cluster
          return (
            <CreateBatch
              clusterId={collection.clusterId}
              batchCreatorId={userId}
            />
          );
        }}
      </PlasticCollectionsDetails>
      <Text>Batches</Text>
      <BatchDetails batches={sortedBatches.created} title="Oprettede">
        {(batch) => <RegisterBatchSent batchId={batch.id} />}
      </BatchDetails>
      <BatchDetails batches={sortedBatches.sent} title="Afsendte" />
      <BatchDetails batches={sortedBatches.received} title="Modtaget" />
    </Container>
  );
};

type RegisterBatchSentProps = {
  batchId: string;
};

const RegisterBatchSent: FC<RegisterBatchSentProps> = ({ batchId }) => {
  const accessToken = useAccessToken();

  const markBatchAsSent = () => {
    axios.post(
      "/RegisterBatchSent",
      {},
      { ...axiosUtils.getSharedAxiosConfig(accessToken), params: { batchId } }
    );
  };
  return <Button title="Marker som afsendt" onPress={markBatchAsSent} />;
};

export default RecipientScreen;
