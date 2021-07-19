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

  // TODO: Consider making this its own hook at some point!
  const [plasticCollectionsSortKey, setPlasticCollectionsSortKey] = useState<
    string | undefined
  >();
  const togglePlasticCollectionsSorting =
    (localSortKey: string) => (shouldSort: boolean) => {
      if (shouldSort) {
        setPlasticCollectionsSortKey(localSortKey);
      } else {
        setPlasticCollectionsSortKey(undefined);
      }
    };

  const {
    data: plasticCollections,
    refetch: refetchPlasticCollections,
    isLoading: plasticCollectionsIsLoading,
  } = useQueriedData<PlasticCollection[]>("/GetPlasticCollections", {
    recipientPartnerId: userId,
    sortKey: plasticCollectionsSortKey,
  });

  // TODO: Consider making this its own hook at some point!
  const [batchesSortKey, setBatchesSortKey] = useState<string | undefined>();
  const toggleBatchSorting =
    (localSortKey: string) => (shouldSort: boolean) => {
      if (shouldSort) {
        setBatchesSortKey(localSortKey);
      } else {
        setBatchesSortKey(undefined);
      }
    };

  const {
    data: batches,
    refetch: refetchBatches,
    isLoading: batchesIsLoading,
  } = useQueriedData<Batch[]>("/GetBatches", {
    recipientPartnerId: userId,
    sortKey: batchesSortKey,
  });

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
              sorting={{
                displayName: "modtaget dato",
                sortState: [
                  plasticCollectionsSortKey === "deliveryDate",
                  togglePlasticCollectionsSorting("deliveryDate"),
                ],
              }}
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
              sorting={{
                displayName: "bekræftet dato",
                sortState: [
                  plasticCollectionsSortKey === "receivedDate",
                  togglePlasticCollectionsSorting("receivedDate"),
                ],
              }}
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
              sorting={{
                displayName: "oprettet dato",
                sortState: [
                  batchesSortKey === "createdAt",
                  toggleBatchSorting("createdAt"),
                ],
              }}
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
            <BatchDetails
              batches={sortedBatches.sent}
              sorting={{
                displayName: "afsendt dato",
                sortState: [
                  batchesSortKey === "sentDate",
                  toggleBatchSorting("sentDate"),
                ],
              }}
            />
          </View>
        )}
        {selectedContext === "Bekræftede batches" && (
          <View>
            {batchesIsLoading && <LoadingIndicator />}
            <BatchDetails
              batches={sortedBatches.received}
              sorting={{
                displayName: "modtaget dato",
                sortState: [
                  batchesSortKey === "receivedDate",
                  toggleBatchSorting("receivedDate"),
                ],
              }}
            />
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
