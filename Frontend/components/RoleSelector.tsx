import { useFormikContext } from "formik";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import { AppRole } from "../hooks/useAppRoles";
import Container from "./shared/Container";

type Props = {
  formKey: string;
  appRoles: AppRole[];
};

export default function RoleSelector({ formKey: key, appRoles }: Props) {
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

    return (
      <Container style={{ flexDirection: "row", justifyContent: "center" }}>
        {appRoles.map((availableAppRole: AppRole) => {
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
        })}
      </Container>
    );
  }
}
