import axios, { AxiosResponse } from "axios";
import { useFormikContext } from "formik";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  // TODO: Fix this deprecation!
  CheckBox,
  ViewProps,
  Button,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { AccessTokenContext } from "../navigation/TabNavigator";
// TODO: Fix this
// import { CheckBox } from "@react-native-community/checkbox";
import axiosUtils from "../utils/axios";
import Container from "./shared/Container";

type Props = {
  formKey: string;
};

type AppRole = {
  displayName: string;
  id: string;
};

export default function RoleSelector({ formKey: key }: Props) {
  const formikProps = useFormikContext<any>();
  const { colors } = useTheme();

  if (!formikProps) {
    throw Error(
      "Incorrect use of select partners form. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, setFieldValue } = formikProps;

    const selectedRole = values[key];
    const setSelectedRole = (newValue: any) => {
      setFieldValue(key, newValue);
    };

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
      <Container style={{ flexDirection: "row", justifyContent: "center" }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          availableAppRoles.map((availableAppRole: AppRole) => {
            const roleIsSelected = selectedRole === availableAppRole.id;
            const selectRole = () => {
              setSelectedRole(availableAppRole.id);
            };

            return (
              <TouchableOpacity onPress={selectRole} key={availableAppRole.id}>
                <View
                  style={{
                    marginRight: 10,
                    padding: 10,
                    borderRadius: 4,
                    backgroundColor: roleIsSelected ? colors.primary : "grey",
                  }}
                >
                  <Text>{availableAppRole.displayName}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  roleBtn: {
    marginRight: 10,
  },
});
