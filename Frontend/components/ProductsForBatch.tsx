import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axiosUtils from "../utils/axios";
import useAccessToken from "../hooks/useAccessToken";
import DismissableSnackbar from "./shared/DismissableSnackbar";
import FormContainer from "./shared/FormContainer";
import NumberField from "./inputs/NumberField";
import SubmitButton from "./inputs/SubmitButton";

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

type CreateProductFormData = {
  productNumber?: number;
};

const ProductsForBatch: FC<Props> = ({
  clusterId,
  productionPartnerId,
  batchId,
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const initialFormValues: CreateProductFormData = {};
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

  const createProduct = (
    values: CreateProductFormData,
    resetForm: () => void
  ) => {
    axios
      .post(
        "/CreateProduct",
        {
          clusterId,
          productionPartnerId,
          batchId,
          productNumber: values.productNumber,
        },
        { ...axiosUtils.getSharedAxiosConfig(accessToken) }
      )
      .then(() => {
        resetForm();
      });
  };

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
      <Text>Opret produkt</Text>
      <FormContainer
        initialValues={initialFormValues}
        onSubmit={(values, formikHelpers) =>
          createProduct(values, formikHelpers.resetForm)
        }
      >
        <NumberField formKey="productNumber" label="Varenummer" />
        <SubmitButton title="Opret produkt" />
        <DismissableSnackbar
          title="Produkt oprettet"
          showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
        />
      </FormContainer>
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

export default ProductsForBatch;
