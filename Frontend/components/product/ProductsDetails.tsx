import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import axiosUtils from "../../utils/axios";
import Subheader from "../styled/Subheader";
import useAccessToken from "../../hooks/useAccessToken";
import InformationText from "../styled/InformationText";

type Props = {
  batchId: string;
};

export type Product = {
  id: string;
  productNumber: number;
  hasBeenSent: boolean;
};

const ProductsDetails: FC<Props> = ({ batchId }) => {
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
      <Subheader>Produkter lavet ud af batch</Subheader>
      {products.map((product, index) => {
        const isLastProduct = index === products.length - 1;

        return (
          <View key={product.id} style={styles.productContainer}>
            <View style={styles.productNumber}>
              <InformationText>
                Varenummer ${product.productNumber}
              </InformationText>
            </View>
            <View style={styles.productStatus}>
              {product.hasBeenSent ? (
                <Text>Produktet er afsendt</Text>
              ) : (
                <MarkProductAsSentButton productId={product.id} />
              )}
            </View>
            {!isLastProduct && <Divider />}
          </View>
        );
      })}
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
    textAlign: "center",
    padding: 15,
    borderColor: "rgb(211, 211, 211)",
    borderStyle: "solid",
    borderWidth: 1,
  },
  productContainer: {
    marginTop: 15,
    flexDirection: "row",
  },
  productNumber: {
    flex: 2,
    alignSelf: "center",
  },
  productStatus: {
    flex: 1,
  },
});

export default ProductsDetails;
