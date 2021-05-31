import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import { StyleSheet, View } from "react-native";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";
import useAxiosConfig from "../../hooks/useAxiosConfig";

type Props = {
  clusterId: string;
  productionPartnerId: string;
  batchId: string;
};

type CreateProductFormData = {
  productNumber?: number;
};

const validationSchema = yup.object().shape({
  productNumber: yup.number().required("Varenummer er påkrævet"),
});

const CreateProduct: FC<Props> = ({
  clusterId,
  productionPartnerId,
  batchId,
}) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);
  const initialFormValues: CreateProductFormData = {};
  const sharedAxiosConfig = useAxiosConfig();

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
        { ...sharedAxiosConfig }
      )
      .then(() => {
        showGlobalSnackbar("Produkt oprettet");
        resetForm();
      });
  };

  return (
    <View style={styles.container}>
      <FormContainer
        initialValues={initialFormValues}
        onSubmit={(values, formikHelpers) =>
          createProduct(values, formikHelpers.resetForm)
        }
        validationSchema={validationSchema}
      >
        <NumberField formKey="productNumber" label="Varenummer" />
        <SubmitButton title="Opret produkt" />
      </FormContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(211, 211, 211)",
    padding: 15,
  },
});

export default CreateProduct;
