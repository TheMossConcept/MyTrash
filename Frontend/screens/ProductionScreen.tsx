import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { Button, View } from "react-native";
import axiosUtils from "../utils/axios";
import { TabsParamList } from "../typings/types";
import useAccessToken from "../hooks/useAccessToken";
import sortBatchByStatus from "../utils/batch";
import BatchDetails, { Batch } from "../components/batch/BatchDetails";
import DismissableSnackbar from "../components/shared/DismissableSnackbar";
import ProductsDetails from "../components/product/ProductsDetails";
import Container from "../components/shared/Container";

type Props = StackScreenProps<TabsParamList, "Produktion">;

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
          <ProductsDetails
            batchId={batch.id}
            productionPartnerId={userId}
            clusterId={batch.clusterId}
          />
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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const confirmReception = () => {
    axios
      .post(
        "/RegisterBatchReception",
        {},
        { ...axiosUtils.getSharedAxiosConfig(accessToken), params: { batchId } }
      )
      .then(() => {
        setShowSuccessSnackbar(true);
      });
  };

  return (
    <View>
      <Button title="Bekræft modtagelse" onPress={confirmReception} />
      <DismissableSnackbar
        title="Modtagelse bekræftet"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  );
};
