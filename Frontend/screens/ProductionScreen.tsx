import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import axiosUtils from "../utils/axios";
import { TabsParamList } from "../typings/types";
import useAccessToken from "../hooks/useAccessToken";
import sortBatchByStatus from "../utils/batch";
import BatchDetails, { Batch } from "../components/batch/BatchDetails";
import ProductsDetails from "../components/product/ProductsDetails";
import Container from "../components/shared/Container";
import { GlobalSnackbarContext } from "../navigation/TabNavigator";
import CreateProduct from "../components/product/CreateProduct";

type Props = StackScreenProps<TabsParamList, "Production">;

const ProductionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const accessToken = useAccessToken();

  const [batches, setBatches] = useState<Batch[]>([]);

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

  const sortedBatches = sortBatchByStatus(batches);
  return (
    <Container>
      <BatchDetails batches={sortedBatches.sent} title="Modtagne batches">
        {(batch) => <ConfirmBatchReception batchId={batch.id} />}
      </BatchDetails>
      <BatchDetails batches={sortedBatches.received} title="Bekræftede batches">
        {(batch) => (
          <View>
            <View style={styles.createProductView}>
              <CreateProduct
                batchId={batch.id}
                productionPartnerId={userId}
                clusterId={batch.clusterId}
              />
            </View>
            <ProductsDetails batchId={batch.id} />
          </View>
        )}
      </BatchDetails>
    </Container>
  );
};

export default ProductionScreen;

type ConfirmBatchReceptionProps = {
  batchId: string;
};

const ConfirmBatchReception: FC<ConfirmBatchReceptionProps> = ({ batchId }) => {
  const accessToken = useAccessToken();
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const confirmReception = () => {
    axios
      .post(
        "/RegisterBatchReception",
        {},
        { ...axiosUtils.getSharedAxiosConfig(accessToken), params: { batchId } }
      )
      .then(() => {
        showGlobalSnackbar("Modtagelse bekræftet");
      });
  };

  return <Button title="Bekræft modtagelse" onPress={confirmReception} />;
};

const styles = StyleSheet.create({
  createProductView: {
    marginBottom: 15,
  },
});
