import axios from "axios";
import React, { FC, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import axiosUtils from "../utils/axios";
import useAccessToken from "../hooks/useAccessToken";
import { setValue } from "../utils/form";
import NumericInput from "./inputs/NumericInput";

type Props = { clusterId: string };

type BatchCreationState = {
  inputWeight?: number;
  outputWeight?: number;
  additionFactor?: number;
};

const CreateBatch: FC<Props> = ({ clusterId }) => {
  const [formState, setFormState] = useState<BatchCreationState>({});

  const { inputWeight, outputWeight, additionFactor } = formState;
  const setBatchValue = setValue([formState, setFormState]);

  const accessToken = useAccessToken();
  const createBatch = () => {
    axios.post(
      "/CreateBatch",
      { ...formState, clusterId },
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
