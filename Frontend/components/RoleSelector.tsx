import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  CheckBox,
} from "react-native";
// TODO: Fix this
// import { CheckBox } from "@react-native-community/checkbox";
import axiosUtils from "../utils/axios";

type Props = {
  roleSelectionState: [string[], (newValue: string[]) => void];
  selectionDisabled: boolean;
};

type AppRole = {
  displayName: string;
  id: string;
};

export default function RoleSelector({
  roleSelectionState,
  selectionDisabled,
}: Props) {
  // TODO: Make a hook for handling this access token stuff at some point!
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [availableAppRoles, setAvailableAppRoles] = useState<AppRole[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  AsyncStorage.getItem("accessToken").then((localAccessToken) => {
    setAccessToken(localAccessToken || undefined);
  });

  // Initially, fetch the available app roles
  useEffect(() => {
    if (accessToken) {
      setIsLoading(true);

      axios
        .get("/UserAppRoles", {
          params: {
            // TODO: Fix hardcoding!
            code: "oYx2YQIRFLv7fVYRd4aV9Rj/EyzQGwTepONvms8DBLJPquUIh9sDAw==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((response: AxiosResponse<AppRole[]>) => {
          setAvailableAppRoles(response.data);
        })
        .finally(() => setIsLoading(false));
    }
  }, [accessToken]);

  /*
          const onPress = () => {
            if (accessToken) {
              axios
                .post(
                  "/InviteExternalUser",
                  {
                    email: emailToInvite,
                    appRoleId: availableAppRole.id,
                  },
                  {
                    params: {
                      code:
                        "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
                    },
                    ...axiosUtils.getSharedAxiosConfig(accessToken),
                  }
                )
                .then(() => setShowSnackbar(true))
                .finally(() => setIsLoadingInvite(false));

              setEmailToInvite("");
              setIsLoadingInvite(true);
            }
          };
   */

  return (
    <View style={styles.buttonContainer}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        availableAppRoles.map((availableAppRole: AppRole) => (
          <RoleSelectorCheckbox
            appRole={availableAppRole}
            selectionState={roleSelectionState}
            disabled={selectionDisabled}
            key={availableAppRole.id}
          />
        ))
      )}
    </View>
  );
}

type RoleSelectorCheckboxProps = {
  appRole: AppRole;
  selectionState: [string[], (value: string[]) => void];
  disabled: boolean;
};

function RoleSelectorCheckbox({
  appRole,
  selectionState,
  disabled,
}: RoleSelectorCheckboxProps) {
  const { displayName, id } = appRole;
  const [selectedAppRoles, setSelectedAppRoles] = selectionState;

  const checkboxValue = selectedAppRoles.includes(id);
  const onValueChange = (newValue: boolean) => {
    if (newValue) {
      setSelectedAppRoles([...selectedAppRoles, id]);
    } else {
      setSelectedAppRoles(
        selectedAppRoles.filter((selectedAppRole) => selectedAppRole !== id)
      );
    }
  };

  return (
    <View>
      <CheckBox
        value={checkboxValue}
        onValueChange={onValueChange}
        disabled={disabled}
      />
      <Text>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
});
