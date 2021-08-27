import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TabsParamList } from "../typings/types";
import sortBatchByStatus from "../utils/batch";
import BatchDetails, { Batch } from "../components/batch/BatchDetails";
import Container from "../components/shared/Container";
import useAxiosConfig from "../hooks/useAxiosConfig";
import ProductsForBatch from "../components/product/ProductsForBatch";
import GlobalSnackbarContext from "../utils/globalContext";
import ContextSelector from "../components/styled/ContextSelector";
import WebButton from "../components/styled/WebButton";
import useQueriedData from "../hooks/useQueriedData";
import LoadingIndicator from "../components/styled/LoadingIndicator";

type Props = StackScreenProps<TabsParamList, "Produktion">;

const ProductionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;

  const {
    data: batches,
    refetch: refetchBatches,
    isLoading,
  } = useQueriedData<Batch[]>("/GetBatches", {
    productionPartnerId: userId,
  });
  const sortedBatches = sortBatchByStatus(batches || []);

  const contextSelectionState = useState("Modtag batches");
  const [selectedContext] = contextSelectionState;

  return (
    <Container>
      <ContextSelector
        options={["Modtag batches", "Bekræftede batches"]}
        selectionState={contextSelectionState}
      >
        <View style={styles.rightSideContainer}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <View>
              {selectedContext === "Modtag batches" && (
                <BatchDetails batches={sortedBatches.sent}>
                  {(batch) => (
                    <ConfirmBatchReception
                      batchId={batch.id}
                      successCallback={refetchBatches}
                    />
                  )}
                </BatchDetails>
              )}
              {selectedContext === "Bekræftede batches" && (
                <BatchDetails batches={sortedBatches.received}>
                  {(batch) => (
                    <ProductsForBatch
                      batchId={batch.id}
                      clusterId={batch.clusterId}
                      productionPartnerId={userId}
                    />
                  )}
                </BatchDetails>
              )}
            </View>
          )}
        </View>
      </ContextSelector>
    </Container>
  );
};

const styles = StyleSheet.create({
  rightSideContainer: {
    // TODO: This it NOT the best solution but rather just a quick workaround
    maxWidth: "68vw",
  },
});

export default ProductionScreen;

type ConfirmBatchReceptionProps = {
  batchId: string;
  successCallback?: () => void;
};

const ConfirmBatchReception: FC<ConfirmBatchReceptionProps> = ({
  batchId,
  successCallback,
}) => {
  const sharedAxiosConfig = useAxiosConfig();
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const confirmReception = () => {
    axios
      .post(
        "/RegisterBatchReception",
        {},
        { ...sharedAxiosConfig, params: { batchId } }
      )
      .then(() => {
        showGlobalSnackbar("Modtagelse bekræftet");
        if (successCallback) {
          successCallback();
        }
      });
  };

  return (
    <WebButton
      text="Bekræft modtagelse"
      style={{ height: 25 }}
      disabled={false}
      onPress={confirmReception}
    />
  );
};
