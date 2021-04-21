import axios from "axios";
import React, { useContext, useState } from "react";
import { ActivityIndicator, Button, StyleSheet } from "react-native";
import { isEmpty } from "lodash";
import axiosUtils from "../utils/axios";

import { View } from "./Themed";
import DismissableSnackbar from "./shared/DismissableSnackbar";
import RoleSelector from "./RoleSelector";
import UserForm, { UserFormData } from "./UserForm";
import { AccessTokenContext } from "../navigation/TabNavigator";

// TODO: This should come from autogenerated typings from the backend

export default function UserInvitationForm() {
  const [rolesToInviteTo, setRolesToInviteTo] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserFormData>({});
  const [isLoading, setIsLoading] = useState(false);

  const onDismiss = () => {
    setUserData({});
  };

  // TODO: Delegate this to the form and the individual fields. Commmunicate
  // the information back through the type
  const isValid =
    userData.email &&
    userData.phoneNumber &&
    userData.companyName &&
    userData.streetName &&
    userData.city &&
    userData.zipCode &&
    !isEmpty(rolesToInviteTo);

  const [showSnackbar, setShowSnackbar] = useState(false);

  const accessToken = useContext(AccessTokenContext);
  const inviteUser = () => {
    if (accessToken) {
      axios
        .post(
          "/InviteExternalUser",
          {
            ...userData,
            appRoleIds: rolesToInviteTo,
          },
          {
            params: {
              code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
            },
            ...axiosUtils.getSharedAxiosConfig(accessToken),
          }
        )
        .then(() => {
          setShowSnackbar(true);
          setUserData({});
          setRolesToInviteTo([]);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <RoleSelector
            // TODO: Should be the result of the aggregate validation once that is done
            selectionDisabled={false}
            roleSelectionState={[rolesToInviteTo, setRolesToInviteTo]}
          />
        </View>
      )}
      <UserForm userFormState={[userData, setUserData]} />
      <Button onPress={inviteUser} title="Inviter bruger" disabled={!isValid} />
      <DismissableSnackbar
        title="Brugeren er blevet inviteret"
        showState={[showSnackbar, setShowSnackbar]}
        onDismiss={onDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  userForm: {
    marginTop: 20,
    marginBottom: 20,
  },
});
