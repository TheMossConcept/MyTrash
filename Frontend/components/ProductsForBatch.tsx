import axios from "axios";
import React, { FC, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axiosUtils from "../utils/axios";
import useAccessToken from "../hooks/useAccessToken";
import NumericInput from "./inputs/NumericInput";

type Props = {
  clusterId: string;
  productionPartnerId: string;
  batchId: string;
};

const Product: FC<Props> = ({ clusterId, productionPartnerId, batchId }) => {
  const accessToken = useAccessToken();
  const [productNumber, setProductNumer] = useState<number | undefined>(
    undefined
  );

  const createProduct = () => {
    axios.post(
      "/CreateProduct",
      { clusterId, productionPartnerId, batchId, productNumber },
      { ...axiosUtils.getSharedAxiosConfig(accessToken) }
    );
  };

  return (
    <View style={styles.container}>
      {/* TODO: Get products here! If they are not sent, include a button to mark them as sent! */}
      <Text>Opret produkt</Text>
      <NumericInput
        label="Varenummer"
        numberState={[productNumber, setProductNumer]}
      />
      <Button title="Opret product" onPress={createProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
  },
});

export default Product;
