import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  // TODO: Fix this deprecation!
  CheckBox,
  ViewProps,
} from "react-native";
import { AccessTokenContext } from "../navigation/TabNavigator";
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
  const accessToken = useContext(AccessTokenContext);
  // TODO: Make a hook for handling this access token stuff at some point!
  const [availableAppRoles, setAvailableAppRoles] = useState<AppRole[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Initially, fetch the available app roles
  useEffect(() => {
    if (accessToken) {
      setIsLoading(true);

      axios
        .get("/GetAppRoles", {
          params: {
            // TODO: Fix hardcoding and move this into the getSharedAxiosConfig function!
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
            style={styles.checkbox}
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
} & ViewProps;

function RoleSelectorCheckbox({
  appRole,
  selectionState,
  disabled,
  ...viewProps
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

  // TODO: Disable the spread forbidden rule and spread viewProps
  return (
    <View style={viewProps.style}>
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
  checkbox: {
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
  },
});
