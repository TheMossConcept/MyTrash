import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import CreateProduct from "./CreateProduct";

type Props = {
  clusterId: string;
  productionPartnerId: string;
  batchId: string;
};

export type Product = {
  id: string;
  productNumber: number;
  hasBeenSent: boolean;
};

const ProductsDetails: FC<Props> = ({
  clusterId,
  productionPartnerId,
  batchId,
}) => {
  const accessToken = useAccessToken();

  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    axios
      .get("GetProducts/", {
        ...axiosUtils.getSharedAxiosConfig(accessToken),
        params: { batchId },
      })
      .then((productsResponse) => {
        const productsFromResponse = productsResponse.data;
        setProducts(productsFromResponse);
      });
  }, [accessToken, batchId]);

  return (
    <View style={styles.container}>
      <Text>Produkter lavet ud af batch</Text>
      {products.map((product) => (
        <View key={product.id}>
          <Text>Varenummer ${product.productNumber}</Text>
          {product.hasBeenSent ? (
            <Text>Produktet er afsendt</Text>
          ) : (
            <MarkProductAsSentButton productId={product.id} />
          )}
        </View>
      ))}
      <CreateProduct
        clusterId={clusterId}
        batchId={batchId}
        productionPartnerId={productionPartnerId}
      />
    </View>
  );
};

type MarkProductAsSentButtonProps = {
  productId: string;
};

const MarkProductAsSentButton: FC<MarkProductAsSentButtonProps> = ({
  productId,
}) => {
  const accessToken = useAccessToken();

  const markProductAsSent = () => {
    axios.post(
      "/RegisterProductSent",
      {},
      { ...axiosUtils.getSharedAxiosConfig(accessToken), params: { productId } }
    );
  };

  return <Button title="Marker som afsendt" onPress={markProductAsSent} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
  },
});

export default ProductsDetails;
