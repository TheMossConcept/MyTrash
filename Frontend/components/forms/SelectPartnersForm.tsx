import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AutocompleteInput from "../inputs/AutocompleteInput";
import useAppRoles from "../../hooks/useAppRoles";

type UserInputProps = {
  title?: string;
  usersEndpoint: string;
  formKey:
    | "productionPartnerId"
    | "collectionAdministratorId"
    | "logisticsPartnerId"
    | "recipientPartnerId";
};

type Props = {};

const SelectPartnersForm: FC<Props> = () => {
  const { appRoles } = useAppRoles();
  const [userSelectionData, setUserSelectionData] = useState<UserInputProps[]>(
    []
  );
  useEffect(() => {
    const localUserSelectionData = appRoles.reduce<UserInputProps[]>(
      (accumulator, appRole) => {
        const appRoleValue = appRole.id;
        const title: string | undefined = appRole.displayName;

        const usersEndpoint = `/GetUsersByAppRole?appRole=${appRoleValue}`;

        let formKey:
          | "productionPartnerId"
          | "collectionAdministratorId"
          | "logisticsPartnerId"
          | "recipientPartnerId"
          | undefined;

        switch (appRoleValue) {
          case "ProductionPartner":
            formKey = "productionPartnerId";
            break;
          case "CollectionAdministrator":
            formKey = "collectionAdministratorId";
            break;
          case "LogisticsPartner":
            formKey = "logisticsPartnerId";
            break;
          case "RecipientPartner":
            formKey = "recipientPartnerId";
            break;
          default:
            formKey = undefined;
            break;
        }

        return formKey
          ? [
              ...accumulator,
              {
                title,
                usersEndpoint,
                formKey,
              },
            ]
          : accumulator;
      },
      []
    );

    const appRolesToUse = localUserSelectionData.filter(
      (item) => item !== undefined
    );
    setUserSelectionData(appRolesToUse);
  }, [appRoles]);

  return (
    <View>
      {userSelectionData.map((selectionData, index) => {
        const userSelections = userSelectionData.length;
        const zIndex = userSelections - index;

        const isLastInput = index === userSelections - 1;

        return (
          <View key={selectionData.title} style={{ width: "100%", zIndex }}>
            <AutocompleteInput
              containerStyle={{ zIndex }}
              endpoint={selectionData.usersEndpoint}
              title={selectionData.title}
              style={isLastInput ? undefined : styles.inputField}
              formKey={selectionData.formKey}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    marginBottom: 5,
  },
});

export default SelectPartnersForm;
