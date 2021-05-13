import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import axiosUtils from "../../utils/axios";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import AutocompleteInput from "../inputs/AutocompleteInput";

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
  const [loading, setLoading] = useState(false);
  const accessToken = useContext(AccessTokenContext);

  const [userSelectionData, setUserSelectionData] = useState<UserInputProps[]>(
    []
  );
  useEffect(() => {
    if (accessToken) {
      axios
        .get("/GetAppRoles", {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((appRolesResult) => {
          const appRoles: any[] = appRolesResult.data;
          const localUserSelectionData = appRoles.map((appRole) => {
            const appRoleValue = appRole.id;
            const title: string | undefined = appRole.displayName;

            const usersEndpoint = `/GetUsersByAppRole?appRole=${appRoleValue}`;

            let formKey;
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
                console.warn("DEFAULT CASE IN CLUSTER CREATION FORM!!");
                break;
            }

            return formKey
              ? {
                  title,
                  usersEndpoint,
                  formKey,
                }
              : undefined;
          });

          const localUserSelectionDataRectified = localUserSelectionData.filter(
            (selectionData) => selectionData !== undefined
          ) as UserInputProps[];

          setUserSelectionData(localUserSelectionDataRectified);
        })
        .finally(() => setLoading(false));

      setLoading(true);
    }
  }, [accessToken]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        userSelectionData.map((selectionData, index) => {
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
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    marginBottom: 5,
  },
});

export default SelectPartnersForm;
