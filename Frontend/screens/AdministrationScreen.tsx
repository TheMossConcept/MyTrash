import * as React from "react";
import { StyleSheet } from "react-native";
import ClusterCreationForm from "../components/ClusterCreationForm";

import { View } from "../components/Themed";
import UserInvitationForm from "../components/UserInvitationForm";

export default function AdministrationScreen() {
  return (
    <View style={styles.container}>
      <ClusterCreationForm />
      <UserInvitationForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  autocompleteInput: {
    height: "200px",
  },
});
