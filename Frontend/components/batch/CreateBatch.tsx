import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import { StyleSheet, View } from "react-native";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import AutocompleteInput from "../inputs/AutocompleteInput";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";
import StringField from "../inputs/StringField";

type Props = { batchCreatorId: string; creationCallback: () => void };

type CreateBatchFormData = {
  inputWeight?: number;
  outputWeight?: number;
  additionFactor?: number;
  batchNumber?: string;
  clusterId?: string;
};

const validationSchema = yup.object().shape({
  inputWeight: yup.number().required("Forbrugt plast er påkrævet"),
  outputWeight: yup.number().required("Batch vægt er påkrævet"),
  additionFactor: yup.number().required("Tilsætningsfaktor er påkrævet"),
  batchNumber: yup.string().required("Batch nummer er påkrævet"),
  clusterId: yup.string().required("Et batch skal tilknyttes et cluster"),
});

const CreateBatch: FC<Props> = ({ batchCreatorId, creationCallback }) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);
  const initialValues: CreateBatchFormData = {};

  const sharedAxiosConfig = useAxiosConfig();
  const createBatch = (values: CreateBatchFormData, resetForm: () => void) => {
    axios
      .post(
        "/CreateBatch",
        // At the moment, it is a system invariant that a batch is always
        // created by a recipient partner. Consider making that more explicit!
        {
          ...values,
          recipientPartnerId: batchCreatorId,
          creationDate: new Date().toISOString(),
        },
        {
          ...sharedAxiosConfig,
        }
      )
      .then(() => {
        showGlobalSnackbar("Batch oprettet");
        resetForm();
        creationCallback();
      });
  };

  return (
    <FormContainer
      initialValues={initialValues}
      onSubmit={(values, formikHelpers) => {
        const resetForm = () => {
          formikHelpers.resetForm();
          formikHelpers.validateForm();
        };

        createBatch(values, resetForm);
      }}
      validationSchema={validationSchema}
      validateOnMount
    >
      <View style={styles.container}>
        <View style={[{ zIndex: 1 }, styles.inputField]}>
          <AutocompleteInput
            formKey="clusterId"
            endpoint="/GetClusters"
            title="Cluster"
            containerStyle={{ zIndex: 1 }}
          />
        </View>
        <StringField
          formKey="batchNumber"
          label="Batchnummer"
          style={styles.inputField}
        />
        <NumberField
          formKey="inputWeight"
          label="Forbrugt plast i kg"
          style={styles.inputField}
        />
        <NumberField
          formKey="outputWeight"
          label="Batch vægt i kg"
          style={styles.inputField}
        />
        <NumberField
          formKey="additionFactor"
          label="Tilsætningsfaktor i procent"
          style={styles.inputField}
        />
        <SubmitButton title="Opret batch" style={styles.submitButton} isWeb />
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: 1024,
  },
  inputField: {
    marginRight: 12,
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});

export default CreateBatch;
