import axios from "axios";
import * as yup from "yup";
import React, { FC, useContext } from "react";
import { View } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import AutocompleteInput from "../inputs/AutocompleteInput";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";

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

  const accessToken = useAccessToken();
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
          ...axiosUtils.getSharedAxiosConfig(accessToken),
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
    >
      <View>
        <View style={{ zIndex: 1 }}>
          <AutocompleteInput
            formKey="clusterId"
            endpoint="/GetClusters"
            title="Cluster"
            containerStyle={{ zIndex: 1 }}
          />
        </View>
        <NumberField formKey="inputWeight" label="Forbrugt plast" />
        <NumberField formKey="outputWeight" label="Batch vægt" />
        <NumberField formKey="additionFactor" label="Tilsætningsfaktor" />
        <SubmitButton title="Opret batch" />
      </View>
    </FormContainer>
  );
};

export default CreateBatch;
