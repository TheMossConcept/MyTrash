import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import UserInvitationForm from "../components/UserInvitationForm";

export default function AdministrationScreen() {
  return (
    <View style={styles.container}>
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
});
