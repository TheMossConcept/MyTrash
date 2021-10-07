import axios from "axios";
import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import HeadlineText from "../styled/HeadlineText";
import globalStyles from "../../utils/globalStyles";
import WebButton from "../styled/WebButton";
import { Product } from "../../typings/types";
import LoadingIndicator from "../styled/LoadingIndicator";

type Props = {
  products: Product[];
  refetchProducts?: () => void;
};

const ProductsDetails: FC<Props> = ({ products, refetchProducts }) => {
  return products.length !== 0 ? (
    <View style={styles.container}>
      <HeadlineText text="Oprettede produkter" style={styles.headlineText} />
      {products.map((product, index) => {
        const isLastProduct = index === products.length - 1;

        return (
          <View key={product.id} style={styles.productContainer}>
            <View style={styles.productNumberContainer}>
              <Text
                style={[globalStyles.subheaderText, styles.productNumberText]}
              >
                Varenummer {product.productNumber}
              </Text>
            </View>
            <View style={styles.productStatus}>
              {product.hasBeenSent ? (
                <Text style={globalStyles.subheaderText}>Afsendt</Text>
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
  ) : null;
};

type MarkProductAsSentButtonProps = {
  productId: string;
  successCallback?: () => void;
};

const MarkProductAsSentButton: FC<MarkProductAsSentButtonProps> = ({
  productId,
  successCallback,
}) => {
  const [loading, setLoading] = useState(false);

  const sharedAxiosConfig = useAxiosConfig();

  const markProductAsSent = () => {
    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return loading ? (
    <LoadingIndicator />
  ) : (
    <WebButton
      text="Marker som afsendt"
      onPress={markProductAsSent}
      disabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderColor: "rgb(211, 211, 211)",
    borderStyle: "solid",
    borderWidth: 1,
  },
  productContainer: {
    marginTop: 15,
    flexDirection: "row",
  },
  productNumberContainer: {
    flex: 2,
    alignSelf: "center",
  },
  productNumberText: {
    textAlign: "left",
  },
  productStatus: {
    flex: 1,
  },
  headlineText: { alignItems: "flex-start" },
});

export default ProductsDetails;
