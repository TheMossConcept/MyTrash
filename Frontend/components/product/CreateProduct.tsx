import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
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
  const [loading, setLoading] = useState(false);

  const showGlobalSnackbar = useContext(GlobalSnackbarContext);
  const initialFormValues: CreateProductFormData = {};
  const sharedAxiosConfig = useAxiosConfig();

  const createProduct = (
    values: CreateProductFormData,
    resetForm: () => void
  ) => {
    setLoading(true);

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
        showGlobalSnackbar("Vare oprettet");
        resetForm();

        if (successCallback) {
          successCallback();
        }
      })
      .finally(() => {
        setLoading(false);
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
      {loading && <ActivityIndicator />}
      <SubmitButton title="Opret vare" isWeb />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  productNumberField: {
    marginBottom: 23,
  },
});

export default CreateProduct;
