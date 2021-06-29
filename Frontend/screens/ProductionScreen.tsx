import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useContext } from "react";
import { Button, StyleSheet } from "react-native";
import { TabsParamList } from "../typings/types";
import sortBatchByStatus from "../utils/batch";
import BatchDetails from "../components/batch/BatchDetails";
import Container from "../components/shared/Container";
import useAxiosConfig from "../hooks/useAxiosConfig";
import useBatches from "../hooks/useBatches";
import ProductsForBatch from "../components/product/ProductsForBatch";
import GlobalSnackbarContext from "../utils/globalContext";

type Props = StackScreenProps<TabsParamList, "Produktion">;

const ProductionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;

  const { batches, refetchBatches } = useBatches({
    recipientPartnerId: userId,
  });
  const sortedBatches = sortBatchByStatus(batches);

  return (
    <Container>
      <BatchDetails batches={sortedBatches.sent} title="Modtagne batches">
        {(batch) => (
          <ConfirmBatchReception
            batchId={batch.id}
            successCallback={refetchBatches}
          />
        )}
      </BatchDetails>
      <BatchDetails batches={sortedBatches.received} title="Bekræftede batches">
        {(batch) => (
          <ProductsForBatch
            batchId={batch.id}
            clusterId={batch.clusterId}
            productionPartnerId={userId}
          />
        )}
      </BatchDetails>
    </Container>
  );
};

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

  return <Button title="Bekræft modtagelse" onPress={confirmReception} />;
};

const styles = StyleSheet.create({
  createProductView: {
    marginBottom: 15,
  },
});
