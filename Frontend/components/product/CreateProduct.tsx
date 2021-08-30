import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { FormikHelpers } from "formik";
import FormContainer from "../shared/FormContainer";
import SubmitButton from "../inputs/SubmitButton";
import StringField from "../inputs/StringField";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";
import LoadingIndicator from "../styled/LoadingIndicator";

type Props = {
  clusterId: string;
  productionPartnerId: string;
  batchId: string;
  successCallback?: () => void;
};

type CreateProductFormData = {
  productNumber?: string;
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
  const initialFormValues: CreateProductFormData = { productNumber: "" };
  const sharedAxiosConfig = useAxiosConfig();

  const createProduct = (
    values: CreateProductFormData,
    helpers: FormikHelpers<CreateProductFormData>
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

        if (successCallback) {
          successCallback();
        }
      })
      .finally(() => {
        helpers.resetForm();
        helpers.validateForm();

        setLoading(false);
      });
  };

  return (
    <FormContainer
      initialValues={initialFormValues}
      onSubmit={(values, formikHelpers) => createProduct(values, formikHelpers)}
      validationSchema={validationSchema}
      validateOnMount
    >
      <StringField
        formKey="productNumber"
        label="Varenummer"
        style={styles.productNumberField}
      />
      {loading && <LoadingIndicator />}
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
