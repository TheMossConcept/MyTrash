import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";

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

  const accessToken = useAccessToken();
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
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        }
      )
      .then(() => {
        showGlobalSnackbar("Aflevering registreret");
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
      <NumberField formKey="weight" label="Vægt" />
      <SubmitButton title="Register aflevering" />
    </FormContainer>
  );
};

export default DeliverPlasticCollection;
