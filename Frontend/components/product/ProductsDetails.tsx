import axios from "axios";
import React, { FC } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import Subheader from "../styled/Subheader";
import InformationText from "../styled/InformationText";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import { Product } from "../../hooks/useProducts";

type Props = {
  products: Product[];
  refetchProducts?: () => void;
};

const ProductsDetails: FC<Props> = ({ products, refetchProducts }) => {
  return (
    <View style={styles.container}>
      <Subheader>Produkter lavet ud af batch</Subheader>
      {products.map((product, index) => {
        const isLastProduct = index === products.length - 1;

        return (
          <View key={product.id} style={styles.productContainer}>
            <View style={styles.productNumber}>
              <InformationText>
                Varenummer {product.productNumber}
              </InformationText>
            </View>
            <View style={styles.productStatus}>
              {product.hasBeenSent ? (
                <Text>Produktet er afsendt</Text>
              ) : (
                <MarkProductAsSentButton
                  productId={product.id}
                  successCallback={refetchProducts}
                />
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
  successCallback?: () => void;
};

const MarkProductAsSentButton: FC<MarkProductAsSentButtonProps> = ({
  productId,
  successCallback,
}) => {
  const sharedAxiosConfig = useAxiosConfig();

  const markProductAsSent = () => {
    axios
      .post(
        "/RegisterProductSent",
        {},
        { ...sharedAxiosConfig, params: { productId } }
      )
      .then(() => {
        if (successCallback) {
          successCallback();
        }
      });
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
