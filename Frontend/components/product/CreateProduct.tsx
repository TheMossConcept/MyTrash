import axios from "axios";
import * as yup from "yup";
import React, { FC, useState } from "react";
import { Text } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import DismissableSnackbar from "../shared/DismissableSnackbar";

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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
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
      <DismissableSnackbar
        title="Produkt oprettet"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </FormContainer>
  );
};

export default CreateProduct;
