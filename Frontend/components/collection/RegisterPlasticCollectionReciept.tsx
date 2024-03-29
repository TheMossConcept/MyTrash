import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import { StyleSheet } from "react-native";
import { PlasticCollection } from "./PlasticCollectionsDetails";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";

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

  const sharedAxiosConfig = useAxiosConfig();
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
          ...sharedAxiosConfig,
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
      validateOnMount
    >
      <NumberField
        formKey="weight"
        label="Vægt i kg"
        style={styles.weightField}
      />
      <SubmitButton title="Register modtagelse" isWeb />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  weightField: {
    marginBottom: 29,
  },
});

export default RegisterPlasticCollectionReciept;
