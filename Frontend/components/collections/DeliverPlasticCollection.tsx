import axios from "axios";
import React, { FC, useState } from "react";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import DismissableSnackbar from "../shared/DismissableSnackbar";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";

type Props = { plasticCollectionId: string };

type DeliverPlasticCollectionFormData = {
  weight?: number;
};

const DeliverPlasticCollection: FC<Props> = ({ plasticCollectionId }) => {
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
      });
  };

  return (
    <FormContainer
      initialValues={initialValues}
      onSubmit={(values, formikHelpers) =>
        registerDelivery(values, formikHelpers.resetForm)
      }
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
