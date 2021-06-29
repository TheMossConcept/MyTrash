import axios from "axios";
import React, { FC, useContext } from "react";
// TODO: Fix it so that we use buttons from react-native-paper instead
import * as yup from "yup";
import FormContainer from "../shared/FormContainer";
import StringField from "../inputs/StringField";
import BooleanField from "../inputs/BooleanField";
import SubmitButton from "../inputs/SubmitButton";
import NumberField from "../inputs/NumberField";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";

type CollectionFormData = {
  numberOfUnits?: number;
  comment?: string;
  isLastCollection: boolean;
};

type Props = {
  userId: string;
  clusterId: string;
  successCallback: () => void;
};

const validationSchema = yup.object().shape({
  numberOfUnits: yup
    .number()
    .min(1, "Der skal minimum være en enhed")
    .required("Antal enheder er påkrævet"),
  comment: yup.string().optional(),
  isLastCollection: yup.boolean().optional(),
});

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const CollectionForm: FC<Props> = ({ userId, clusterId, successCallback }) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);
  const initialValues: CollectionFormData = {
    isLastCollection: false,
    comment: "",
  };

  const sharedAxiosConfig = useAxiosConfig();
  const createCollectionRequest = (
    values: CollectionFormData,
    reset: () => void
  ) => {
    axios
      .post(
        "/CreatePlasticCollection",
        { clusterId, requesterId: userId, ...values },
        { ...sharedAxiosConfig }
      )
      .then(() => {
        showGlobalSnackbar("Afhentning bestilt");
        reset();

        successCallback();
      });
  };

  return (
    <FormContainer
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) => {
        createCollectionRequest(values, formikHelpers.resetForm);
      }}
      validateOnMount
    >
      <NumberField label="Antal enheder" formKey="numberOfUnits" />
      <StringField label="Kommentar" formKey="comment" />
      <BooleanField label="Sidste opsamling" formKey="isLastCollection" />

      <SubmitButton title="Bestil afhentning" />
    </FormContainer>
  );
};

export default CollectionForm;
