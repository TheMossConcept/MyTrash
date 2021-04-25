import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";
import { setValue } from "../../utils/form";
import AutocompleteInput from "../inputs/AutocompleteInput";
import BooleanInput from "../inputs/BooleanInput";
import NumericInput from "../inputs/NumericInput";
import StringInput from "../inputs/StringInput";
import DismissableSnackbar from "../shared/DismissableSnackbar";

type ClusterCreationFormData = {
  isOpen?: boolean;
  name?: string;
  c5Reference?: string;
  necessaryPlastic?: number;
  usefulPlasticFactor?: number;
  productionPartnerId?: string;
  collectionAdministratorId?: string;
  logisticsPartnerId?: string;
  recipientPartnerId?: string;
};

type UserInputProps = {
  title?: string;
  usersEndpoint: string;
  stateKey:
    | "productionPartnerId"
    | "collectionAdministratorId"
    | "logisticsPartnerId"
    | "recipientPartnerId";
};

type Props = {};

const ClusterCreationForm: FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const [clusterData, setClusterData] = useState<ClusterCreationFormData>({
    isOpen: false,
  });
  const [userSelectionData, setUserSelectionData] = useState<UserInputProps[]>(
    []
  );

  const {
    name,
    isOpen,
    c5Reference,
    necessaryPlastic,
    usefulPlasticFactor,
    collectionAdministratorId,
    logisticsPartnerId,
    recipientPartnerId,
  } = clusterData;

  const isValid =
    name &&
    isOpen !== undefined &&
    c5Reference &&
    necessaryPlastic &&
    usefulPlasticFactor &&
    collectionAdministratorId &&
    logisticsPartnerId &&
    recipientPartnerId;

  const resetState = () => {
    setClusterData({});
  };

  const setClusterFormValue = setValue([clusterData, setClusterData]);

  const accessToken = useContext(AccessTokenContext);

  // Only run data fetch once, otherwise the state update of an
  // array will cause an infinite reload because it is a new instance
  // each time
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

  const onCreateCluster = () => {
    if (accessToken) {
      axios
        .post("/CreateCluster", clusterData, {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then(() => {
          setShowSuccessSnackbar(true);
          resetState();
        });
    }
  };

  return (
    <View style={styles.container}>
      <StringInput
        label="Navn"
        stringState={[name, setClusterFormValue("name")]}
      />
      <StringInput
        label="C5 Reference"
        stringState={[c5Reference, setClusterFormValue("c5Reference")]}
      />
      <NumericInput
        label="Plastbehov"
        numberState={[
          necessaryPlastic,
          setClusterFormValue("necessaryPlastic"),
        ]}
      />
      <NumericInput
        label="Beregningsfaktor"
        numberState={[
          usefulPlasticFactor,
          setClusterFormValue("usefulPlasticFactor"),
        ]}
      />
      {/* TODO_SESSION: If the cluser is closed, we need the system to generate a link to invite collectors */}
      <BooleanInput
        label="Åbent cluster"
        booleanState={[isOpen || false, setClusterFormValue("isOpen")]}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        userSelectionData.map((selectionData) => (
          /* TODO: Get a better key !! */
          <View
            style={styles.autocompleteInputContainer}
            key={selectionData.title}
          >
            <AutocompleteInput
              selectionState={[
                clusterData[selectionData.stateKey],
                setClusterFormValue(selectionData.stateKey),
              ]}
              endpoint={selectionData.usersEndpoint}
              title={selectionData.title}
            />
          </View>
        ))
      )}
      <Button
        title="Opret cluster"
        onPress={onCreateCluster}
        disabled={!isValid}
      />
      <DismissableSnackbar
        title="Clusteret blev oprettet"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "auto",
    // Obviously, this is just a temporary layout "fix"
    height: "250px",
  },
  autocompleteInputContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
  },
});

export default ClusterCreationForm;
