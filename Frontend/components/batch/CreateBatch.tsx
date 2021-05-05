import axios from "axios";
import React, { FC, useState } from "react";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import DismissableSnackbar from "../shared/DismissableSnackbar";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";

type Props = { clusterId: string; batchCreatorId: string };

type CreateBatchFormData = {
  inputWeight?: number;
  outputWeight?: number;
  additionFactor?: number;
};

const CreateBatch: FC<Props> = ({ clusterId, batchCreatorId }) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
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
          clusterId,
          recipientPartnerId: batchCreatorId,
          creationDate: new Date().toISOString(),
        },
        {
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
        createBatch(values, formikHelpers.resetForm)
      }
    >
      <NumberField formKey="inputWeight" label="Forbrugt plast" />
      <NumberField formKey="outputWeight" label="Batch vægt" />
      <NumberField formKey="additionFactor" label="Tilsætningsfaktor" />
      <SubmitButton title="Opret batch" />
      <DismissableSnackbar
        title="Batch oprettet"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </FormContainer>
  );
};

export default CreateBatch;
