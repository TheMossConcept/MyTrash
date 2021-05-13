import axios from "axios";
import * as yup from "yup";
import React, { FC, useState } from "react";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import DismissableSnackbar from "../shared/DismissableSnackbar";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";

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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

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
        setShowSuccessSnackbar(true);
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
      <DismissableSnackbar
        title="Aflevering registreret"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </FormContainer>
  );
};

export default DeliverPlasticCollection;
