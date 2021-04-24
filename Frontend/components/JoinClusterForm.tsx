import React, { FC, useState } from "react";
import { Button, View, Text } from "react-native";
import AutocompleteInput from "./InputElements/AutocompleteInput";
import UserForm, { UserFormData } from "./UserForm";

type Props = {
  clusterId?: string;
};

// TODO_SESSION: Get the clusterId from deep linking. This happens in
// the case of a closed cluster
const JoinClusterForm: FC<Props> = ({ clusterId }) => {
  const userFormDataState = useState<UserFormData>({});
  const [selectedClusterId, setSelectedClusterId] = useState(clusterId);
  const joinCluster = () => {
    console.log("Not implemented");
  };
  return (
    <View>
      <UserForm isPartner={false} userFormState={userFormDataState} />
      {selectedClusterId !== undefined ? (
        <Text>{selectedClusterId}</Text>
      ) : (
        <AutocompleteInput
          selectionState={[selectedClusterId, setSelectedClusterId]}
          endpoint="/GetClusters"
        />
      )}
      <Button title="Tilmeld" onPress={joinCluster} />
    </View>
  );
};

export default JoinClusterForm;
