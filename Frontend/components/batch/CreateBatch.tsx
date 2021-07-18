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

type Props = { batchCreatorId: string; creationCallback: () => void };

type CreateBatchFormData = {
  inputWeight?: number;
  outputWeight?: number;
  additionFactor?: number;
  clusterId?: string;
};

const validationSchema = yup.object().shape({
  inputWeight: yup.number().required("Forbrugt plast er påkrævet"),
  outputWeight: yup.number().required("Batch vægt er påkrævet"),
  additionFactor: yup.number().required("Tilsætningsfaktor er påkrævet"),
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
      onSubmit={(values, formikHelpers) =>
        createBatch(values, formikHelpers.resetForm)
      }
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
        <NumberField
          formKey="inputWeight"
          label="Forbrugt plast"
          style={styles.inputField}
        />
        <NumberField
          formKey="outputWeight"
          label="Batch vægt"
          style={styles.inputField}
        />
        <NumberField
          formKey="additionFactor"
          label="Tilsætningsfaktor"
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
    alignItems: "flex-start",
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
