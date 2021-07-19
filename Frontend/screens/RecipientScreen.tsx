import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
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
import useQueriedData from "../hooks/useQueriedData";
import LoadingIndicator from "../components/styled/LoadingIndicator";

type Props = StackScreenProps<TabsParamList, "Modtagelse">;

const RecipientScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const {
    data: plasticCollections,
    refetch: refetchPlasticCollections,
    isLoading: plasticCollectionsIsLoading,
  } = useQueriedData<PlasticCollection[]>("/GetPlasticCollections", {
    recipientPartnerId: userId,
  });

  const {
    data: batches,
    refetch: refetchBatches,
    isLoading: batchesIsLoading,
  } = useQueriedData<Batch[]>("/GetBatches", { recipientPartnerId: userId });

  const sortedCollections = sortCollectionsByStatus(plasticCollections || []);
  const sortedBatches = sortBatchByStatus(batches || []);

  const contextSelectionState = useState("Modtaget");
  const [selectedContext] = contextSelectionState;

  return (
    <Container style={styles.container}>
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
          <View>
            {plasticCollectionsIsLoading && <LoadingIndicator />}
            <PlasticCollectionsDetails
              plasticCollections={sortedCollections.delivered}
              hideWeight
            >
              {(collection) => (
                <RegisterPlasticCollectionReciept
                  plasticCollection={collection}
                  successCallback={refetchPlasticCollections}
                />
              )}
            </PlasticCollectionsDetails>
          </View>
        )}
        {selectedContext === "Bekræftet" && (
          <View>
            {plasticCollectionsIsLoading && <LoadingIndicator />}
            <PlasticCollectionsDetails
              plasticCollections={sortedCollections.received}
            />
          </View>
        )}
        {selectedContext === "Oprettede batches" && (
          <View>
            <CreateBatch
              batchCreatorId={userId}
              creationCallback={refetchBatches}
            />
            {batchesIsLoading && <LoadingIndicator />}
            <BatchDetails
              batches={sortedBatches.created}
              style={styles.createdBatchesDetailsContainer}
            >
              {(batch) => (
                <RegisterBatchSent
                  batchId={batch.id}
                  successCallback={refetchBatches}
                />
              )}
            </BatchDetails>
          </View>
        )}
        {selectedContext === "Afsendte batches" && (
          <View>
            {batchesIsLoading && <LoadingIndicator />}
            <BatchDetails batches={sortedBatches.sent} />
          </View>
        )}
        {selectedContext === "Bekræftede batches" && (
          <View>
            {batchesIsLoading && <LoadingIndicator />}
            <BatchDetails batches={sortedBatches.received} />
          </View>
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
      style={styles.markAsSentButton}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  markAsSentButton: {
    height: 25,
  },
  createdBatchesDetailsContainer: {
    marginTop: 23,
    // TODO: At some point, the Autocomplete Input should handle automatically
    // floating above other elements itself instead of the surroundings having to
    // fit into the AutocompleteInput. This is a temporary workaround for now!
    zIndex: -1,
  },
});

export default RecipientScreen;
