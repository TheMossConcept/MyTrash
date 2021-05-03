import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import axiosUtils from "../../utils/axios";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import AutocompleteInput from "../inputs/AutocompleteInput";

type UserInputProps = {
  title?: string;
  usersEndpoint: string;
  stateKey:
    | "productionPartnerId"
    | "collectionAdministratorId"
    | "logisticsPartnerId"
    | "recipientPartnerId";
};

type StateValue = {
  productionPartnerId?: string;
  collectionAdministratorId?: string;
  logisticsPartnerId?: string;
  recipientPartnerId?: string;
};

type Props = {
  values: StateValue;
  setValues: (field: string, newValue: string) => void;
};

const SelectPartnersForm: FC<Props> = ({ values, setValues }) => {
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
            const appRoleId = appRole.id;
            const appRoleValue = appRole.value;
            const title: string | undefined = appRole.displayName;

            const usersEndpoint = `/GetUsersByAppRole?appRoleId=${appRoleId}`;

            let stateKey;
            switch (appRoleValue) {
              case "ProductionPartner":
                stateKey = "productionPartnerId";
                break;
              case "CollectionAdministrator":
                stateKey = "collectionAdministratorId";
                break;
              case "LogisticsPartner":
                stateKey = "logisticsPartnerId";
                break;
              case "RecipientPartner":
                stateKey = "recipientPartnerId";
                break;
              default:
                console.warn("DEFAULT CASE IN CLUSTER CREATION FORM!!");
                break;
            }

            return stateKey
              ? {
                  title,
                  usersEndpoint,
                  stateKey,
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

          return (
            <AutocompleteInput
              containerStyle={{ zIndex }}
              key={selectionData.title}
              selectionState={[
                values[selectionData.stateKey],
                (newValue: string) =>
                  setValues(selectionData.stateKey, newValue),
              ]}
              endpoint={selectionData.usersEndpoint}
              title={selectionData.title}
            />
          );
        })
      )}
    </View>
  );
};

export default SelectPartnersForm;
