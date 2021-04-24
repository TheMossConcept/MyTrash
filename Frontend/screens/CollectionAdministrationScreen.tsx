import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import UserForm, { UserFormData } from "../components/UserForm";

export default function CollectionAdministrationScreen() {
  const userFormDataState = React.useState<UserFormData>({});
  return (
    <View style={styles.container}>
      {/* TODO_SESSION: Consider whether we should create a separate form for inviting collectors or we can use the same
       * form as for collaborator - I think we can probably just use the same
       */}

      <UserForm userFormState={userFormDataState} isPartner={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
