import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState, useEffect, useCallback, useContext } from "react";
import { Button, View } from "react-native";
import sortCollectionsByStatus from "../utils/plasticCollections";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";

import { TabsParamList } from "../typings/types";
import CreateBatch from "../components/batch/CreateBatch";
import BatchDetails, { Batch } from "../components/batch/BatchDetails";
import sortBatchByStatus from "../utils/batch";
import RegisterPlasticCollectionReciept from "../components/collection/RegisterPlasticCollectionReciept";
import Container from "../components/shared/Container";
import useAxiosConfig from "../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../utils/globalContext";
import ContextSelector from "../components/styled/ContextSelector";
import WebButton from "../components/styled/WebButton";

type Props = StackScreenProps<TabsParamList, "Modtagelse">;

const RecipientScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const sharedAxiosConfig = useAxiosConfig();

  const fetchPlasticCollections = useCallback(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { recipientPartnerId: userId },
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [sharedAxiosConfig, userId]);

  useEffect(() => {
    fetchPlasticCollections();
  }, [fetchPlasticCollections]);

  const fetchBatches = useCallback(() => {
    axios
      .get("/GetBatches", {
        params: { recipientPartnerId: userId },
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setBatches(data);
      });
  }, [sharedAxiosConfig, userId]);

  // Initial fetch
  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);
  const sortedBatches = sortBatchByStatus(batches);

  const contextSelectionState = useState("Modtaget");
  const [selectedContext] = contextSelectionState;

  return (
    <Container>
      <ContextSelector
        options={[
          "Modtaget",
          "Bekræftet",
          "Oprettede batches",
          "Afsendte batches",
          "Bekræftede batches",
        ]}
        selectionState={contextSelectionState}
      >
        {selectedContext === "Modtaget" && (
          <PlasticCollectionsDetails
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
        )}
        {selectedContext === "Bekræftet" && (
          <PlasticCollectionsDetails
            plasticCollections={sortedCollections.received}
          />
        )}
        {selectedContext === "Oprettede batches" && (
          <View>
            <CreateBatch
              batchCreatorId={userId}
              creationCallback={fetchBatches}
            />
            <BatchDetails
              batches={sortedBatches.created}
              style={{ marginTop: 23 }}
            >
              {(batch) => (
                <RegisterBatchSent
                  batchId={batch.id}
                  successCallback={fetchBatches}
                />
              )}
            </BatchDetails>
          </View>
        )}
        {selectedContext === "Afsendte batches" && (
          <BatchDetails batches={sortedBatches.sent} />
        )}
        {selectedContext === "Bekræftede batches" && (
          <BatchDetails batches={sortedBatches.received} />
        )}
      </ContextSelector>
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

  const sharedAxiosConfig = useAxiosConfig();

  const markBatchAsSent = () => {
    axios
      .post(
        "/RegisterBatchSent",
        {},
        { ...sharedAxiosConfig, params: { batchId } }
      )
      .then(() => {
        showGlobalSnackbar("Afsendelse registreret");
        successCallback();
      });
  };
  return (
    <WebButton
      text="Marker som afsendt"
      disabled={false}
      onPress={markBatchAsSent}
      style={{ height: 25 }}
    />
  );
};

export default RecipientScreen;
