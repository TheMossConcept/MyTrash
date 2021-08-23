import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";

type Props = { plasticCollectionId: string; successCallback: () => void };

type DeliverPlasticCollectionFormData = {
  weight?: number;
};

const validationSchema = yup.object().shape({
  weight: yup.number().optional(),
});

const DeliverPlasticCollection: FC<Props> = ({
  plasticCollectionId,
  successCallback,
}) => {
  const initialValues: DeliverPlasticCollectionFormData = {};
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const sharedAxiosConfig = useAxiosConfig();
  const registerDelivery = (
    values: DeliverPlasticCollectionFormData,
    resetForm: () => void
  ) => {
    axios
      .post(
        "/RegisterPlasticCollectionDelivery",
        { ...values },
        {
          params: { collectionId: plasticCollectionId },
          ...sharedAxiosConfig,
        }
      )
      .then(() => {
        showGlobalSnackbar("Afhentning registreret");
        resetForm();

        successCallback();
      });
  };

  return (
    <FormContainer
      initialValues={initialValues}
      onSubmit={(values, formikHelpers) =>
        registerDelivery(values, formikHelpers.resetForm)
      }
      validationSchema={validationSchema}
    >
      <NumberField
        formKey="weight"
        label="Vægt i kg"
        style={{ marginBottom: 23 }}
      />
      <SubmitButton title="Register afhentning" isWeb />
    </FormContainer>
  );
};

export default DeliverPlasticCollection;
