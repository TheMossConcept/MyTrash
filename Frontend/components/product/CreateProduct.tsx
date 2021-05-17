import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import { Text } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";

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
  const accessToken = useAccessToken();

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
        showGlobalSnackbar("Produkt oprettet");
        resetForm();
      });
  };

  return (
    <FormContainer
      initialValues={initialFormValues}
      onSubmit={(values, formikHelpers) =>
        createProduct(values, formikHelpers.resetForm)
      }
      validationSchema={validationSchema}
    >
      <Text>Opret produkt</Text>
      <NumberField formKey="productNumber" label="Varenummer" />
      <SubmitButton title="Opret produkt" />
    </FormContainer>
  );
};

export default CreateProduct;
