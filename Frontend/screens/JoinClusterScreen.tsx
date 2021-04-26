import React, { FC, useState } from "react";
import { Button, View, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import AutocompleteInput from "../components/inputs/AutocompleteInput";
import UserForm, { UserFormData } from "../components/forms/UserForm";
import { RootStackParamList } from "../typings/types";

type Props = StackScreenProps<RootStackParamList, "Join">;

// TODO_SESSION: Get the clusterId from deep linking. This happens in
// the case of a closed cluster
const JoinClusterForm: FC<Props> = ({ route }) => {
  const { clusterId } = route.params || {};
  const [selectedClusterId, setSelectedClusterId] = useState(clusterId);

  const userFormDataState = useState<UserFormData>({});

  const joinCluster = () => {
    // TODO: Call join cluster. We need a user id and thus and id token
    console.log("Not implemented");
  };
  return (
    <View style={styles.container}>
      <UserForm isPartner={false} userFormState={userFormDataState} />
      <AutocompleteInput
        selectionState={[selectedClusterId, setSelectedClusterId]}
        endpoint="/GetOpenClusters"
      />
      <Button title="Tilmeld" onPress={joinCluster} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    margin: "auto",
  },
});

export default JoinClusterForm;
