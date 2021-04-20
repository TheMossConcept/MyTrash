import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { AccessTokenContext } from "../navigation/TabNavigator";
import axiosUtils from "../utils/axios";
import AutocompleteInput, {
  SelectableEntity,
} from "./InputElements/AutocompleteInput";

type Props = {};

type UserInputProps = {
  title?: string;
  users: SelectableEntity[];
  selectionState: [string, (newValue: string) => void];
};

const ClusterCreationForm: FC<Props> = () => {
  // const [loading, setLoading] = useState(false);
  const [userSelectionData, setUserSelectionData] = useState<UserInputProps[]>(
    []
  );

  const productionPartnerSelectionState = useState("");
  const collectionAdministratorSelectionState = useState("");
  const logisticsPartnerSelectionState = useState("");

  const accessToken = useContext(AccessTokenContext);

  // Only run data fetch once, otherwise the state update of an
  // array will cause an infinite reload because it is a new instance
  // each time
  useEffect(() => {
    if (accessToken) {
      const getAppRolesPromise = axios.get("/GetAppRoles", {
        params: {
          code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
        },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      });

      const getUsersByRolePromise = axios.get("/GetUsersByAppRoles", {
        params: {
          code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
        },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      });

      Promise.all([getAppRolesPromise, getUsersByRolePromise]).then(
        ([appRolesResult, usersByRoleResult]) => {
          const appRoles: any[] = appRolesResult.data;
          const usersByRole: any[] = usersByRoleResult.data;

          const selectionData = appRoles.reduce<UserInputProps[]>(
            (accumulator, appRole) => {
              const appRoleId = appRole.id;
              const usersForAppRole = usersByRole[appRoleId];

              // TODO: This can be done WAY more elegantly!!
              if (usersForAppRole.length !== 0) {
                let selectionState;
                if (appRole.value === "CollectionAdministrator") {
                  selectionState = collectionAdministratorSelectionState;
                }
                if (appRole.value === "LogisticsPartner") {
                  selectionState = logisticsPartnerSelectionState;
                }
                if (appRole.value === "ProductionPartner") {
                  selectionState = productionPartnerSelectionState;
                }

                if (selectionState) {
                  return [
                    ...accumulator,
                    {
                      users: usersForAppRole,
                      title: appRole.displayName,
                      selectionState,
                    },
                  ];
                }
              }

              // Fallback to just returning the accumulator if we haven't returned before here
              return accumulator;
            },
            []
          );

          setUserSelectionData(selectionData);
          console.log(appRoles);
          console.log(usersByRoleResult);
        }
      );
      // .finally(() => setLoading(false));

      // setLoading(true);
    }
  }, [accessToken]);

  const onCreateCluster = () => {
    console.log("Not implemented!");
  };

  return (
    <View style={styles.container}>
      {false ? (
        <ActivityIndicator />
      ) : (
        userSelectionData.map((selectionData) => (
          <AutocompleteInput
            /* TODO: Get a better key !! */
            key={selectionData.title}
            selectionState={selectionData.selectionState}
            entities={selectionData.users}
            title={selectionData.title}
          />
        ))
      )}
      <Button title="Opret cluster" onPress={onCreateCluster} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default ClusterCreationForm;
