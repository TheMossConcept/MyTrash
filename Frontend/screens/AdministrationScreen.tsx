import * as React from "react";
import { StyleSheet } from "react-native";
import ClusterCreationForm from "../components/ClusterCreationForm";

import { View } from "../components/Themed";
import UserInvitationForm from "../components/UserInvitationForm";

// TODO_SESSION: Iterate through all (active) clusters and show everything
// except ClusterCreationForm in the context of a cluster
export default function AdministrationScreen() {
  return (
    <View style={styles.container}>
      <ClusterCreationForm />
      {/* TODO_SESSION: Recipient partner and production partner should NOT be linked to a cluster!  */}
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
