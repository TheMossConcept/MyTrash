import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import { PlasticCollection } from "./PlasticCollectionsDetails";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";

type Props = {
  plasticCollection: PlasticCollection;
  successCallback: () => void;
};

type RegisterWeightFormData = {
  weight?: number;
};

const validationSchema = yup.object().shape({
  weight: yup.number().required("Vægt er påkrævet"),
});

const RegisterPlasticCollectionReciept: FC<Props> = ({
  plasticCollection,
  successCallback,
}) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const accessToken = useAccessToken();
  const registerReciept = (
    values: RegisterWeightFormData,
    resetForm: () => void
  ) => {
    axios
      .post(
        "/RegisterPlasticCollectionReceived",
        { ...values },
        {
          params: { collectionId: plasticCollection.id },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        }
      )
      .then(() => {
        showGlobalSnackbar("Modtagelse registreret");
        resetForm();

        successCallback();
      });
  };

  const initialValues: RegisterWeightFormData = {
    weight: plasticCollection.weight,
  };

  return (
    <FormContainer
      initialValues={initialValues}
      onSubmit={(values, formikHelpers) =>
        registerReciept(values, formikHelpers.resetForm)
      }
      validationSchema={validationSchema}
    >
      <NumberField formKey="weight" label="Vægt" />
      <SubmitButton title="Register modtagelse" />
    </FormContainer>
  );
};

export default RegisterPlasticCollectionReciept;
