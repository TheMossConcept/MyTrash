import axios from "axios";
import React, { FC, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import { setValue } from "../../utils/form";
import NumericInput from "../inputs/NumericInput";

type Props = { clusterId: string; batchCreatorId: string };

type BatchCreationState = {
  inputWeight?: number;
  outputWeight?: number;
  additionFactor?: number;
};

const CreateBatch: FC<Props> = ({ clusterId, batchCreatorId }) => {
  const [formState, setFormState] = useState<BatchCreationState>({});

  const { inputWeight, outputWeight, additionFactor } = formState;
  const setBatchValue = setValue([formState, setFormState]);

  const accessToken = useAccessToken();
  const createBatch = () => {
    axios.post(
      "/CreateBatch",
      // At the moment, it is a system invariant that a batch is always
      // created by a recipient partner. Consider making that more explicit!
      {
        ...formState,
        clusterId,
        recipientPartnerId: batchCreatorId,
        creationDate: Date(),
      },
      {
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      }
    );
  };

  return (
    <View style={styles.container}>
      <NumericInput
        numberState={[inputWeight, setBatchValue("inputWeight")]}
        label="Input vægt"
      />
      <NumericInput
        numberState={[outputWeight, setBatchValue("outputWeight")]}
        label="Batch vægt"
      />
      <NumericInput
        numberState={[additionFactor, setBatchValue("additionFactor")]}
        label="Tilsætningsfaktor"
      />
      <Button title="Opret batch" onPress={createBatch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
  },
});

export default CreateBatch;
