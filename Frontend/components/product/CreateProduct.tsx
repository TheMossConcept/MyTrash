import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import { StyleSheet, View } from "react-native";
import FormContainer from "../shared/FormContainer";
import SubmitButton from "../inputs/SubmitButton";
import StringField from "../inputs/StringField";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";

type Props = {
  clusterId: string;
  productionPartnerId: string;
  batchId: string;
  successCallback?: () => void;
};

type CreateProductFormData = {
  productNumber?: number;
};

const validationSchema = yup.object().shape({
  productNumber: yup.string().required("Varenummer er påkrævet"),
});

const CreateProduct: FC<Props> = ({
  clusterId,
  productionPartnerId,
  batchId,
  successCallback,
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

        if (successCallback) {
          successCallback();
        }
      });
  };

  return (
    <FormContainer
      initialValues={initialFormValues}
      onSubmit={(values, formikHelpers) =>
        createProduct(values, formikHelpers.resetForm)
      }
      validationSchema={validationSchema}
      validateOnMount
    >
      <StringField
        formKey="productNumber"
        label="Varenummer"
        style={styles.productNumberField}
      />
      <SubmitButton title="Opret produkt" isWeb />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  productNumberField: {
    marginBottom: 23,
  },
});

export default CreateProduct;
