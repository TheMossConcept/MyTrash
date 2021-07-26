import { useFormikContext } from "formik";
import React from "react";
import { View } from "react-native";
import { AppRole } from "../../hooks/useAppRoles";
import WebButton from "../styled/WebButton";

type Props = {
  formKey: string;
  appRoles: AppRole[];
};

export default function RoleSelector({ formKey: key, appRoles }: Props) {
  const formikProps = useFormikContext<any>();

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
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {appRoles.map((availableAppRole: AppRole) => {
          const roleIsSelected = selectedRole === availableAppRole.id;
          const selectRole = () => {
            setSelectedRole(availableAppRole.id);
          };

          return (
            <WebButton
              text={availableAppRole.displayName}
              onPress={selectRole}
              key={availableAppRole.id}
              isSelected={roleIsSelected}
              style={{ marginRight: 10 }}
            />
          );
        })}
      </View>
    );
  }
}
