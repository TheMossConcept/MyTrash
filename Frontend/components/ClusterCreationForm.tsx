import React, { FC } from "react";
import { Button, View } from "react-native";

type Props = {};

const ClusterCreationForm: FC<Props> = ({}) => {
  const onCreateCluster = () => {
    console.log("Not implemented!");
  };

  return (
    <View>
      <Button title="Opret cluster" onPress={onCreateCluster} />
    </View>
  );
};

export default ClusterCreationForm;
