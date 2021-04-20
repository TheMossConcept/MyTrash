import axios from "axios";
import React, { FC, useContext, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AccessTokenContext } from "../navigation/TabNavigator";
import axiosUtils from "../utils/axios";
import UserInput, { Props as UserInputProps } from "./InputElements/UserInput";

type Props = {};

const ClusterCreationForm: FC<Props> = () => {
  // const [loading, setLoading] = useState(false);
  const [userSelectionData, setUserSelectionData] = useState<UserInputProps[]>(
    []
  );

  const [productionPartnerId, setProductionPartnerId] = useState("");
  const [collectionAdministratorId, setCollectionAdministratorId] = useState(
    ""
  );
  const [logisticsPartnerId, setLogisticsPartnerId] = useState("");

  const accessToken = useContext(AccessTokenContext);

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
              if (appRole.value === "CollectionAdministrator") {
                return [
                  ...accumulator,
                  {
                    users: usersForAppRole,
                    title: appRole.displayName,
                    selectionState: [
                      collectionAdministratorId,
                      setCollectionAdministratorId,
                    ],
                  },
                ];
              }
              if (appRole.value === "LogisticsPartner") {
                return [
                  ...accumulator,
                  {
                    users: usersForAppRole,
                    title: appRole.displayName,
                    selectionState: [logisticsPartnerId, setLogisticsPartnerId],
                  },
                ];
              }
              if (appRole.value === "ProductionPartner") {
                return [
                  ...accumulator,
                  {
                    users: usersForAppRole,
                    title: appRole.displayName,
                    selectionState: [
                      productionPartnerId,
                      setProductionPartnerId,
                    ],
                  },
                ];
              }
            }

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

    const onCreateCluster = () => {
      console.log("Not implemented!");
    };

    return (
      <View style={styles.container}>
        {false ? (
          <ActivityIndicator />
        ) : (
          userSelectionData.map((selectionData) => (
            <UserInput
              /* TODO: Get a better key !! */
              key={selectionData.title}
              selectionState={selectionData.selectionState}
              users={selectionData.users}
              title={selectionData.title}
            />
          ))
        )}
        <Button title="Opret cluster" onPress={onCreateCluster} />
      </View>
    );
  }
  return <Text>Unauthorized. Please refresh the page and try again</Text>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default ClusterCreationForm;
