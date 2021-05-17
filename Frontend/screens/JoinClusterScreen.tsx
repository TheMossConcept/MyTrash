import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import AutocompleteInput from "../components/inputs/AutocompleteInput";
import { RootStackParamList } from "../typings/types";
import CollectorForm from "../components/forms/CollectorForm";

type Props = StackScreenProps<RootStackParamList, "Join">;

// TODO_SESSION: Get the clusterId from deep linking. This happens in
// the case of a closed cluster
const JoinClusterForm: FC<Props> = ({ route }) => {
  const { clusterId } = route.params || {};

  return (
    <View style={styles.container}>
      <CollectorForm submitTitle="Tilmeld" clusterId={clusterId}>
        {clusterId === undefined && (
          <AutocompleteInput formKey="clusterId" endpoint="/GetOpenClusters" />
        )}
      </CollectorForm>
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
