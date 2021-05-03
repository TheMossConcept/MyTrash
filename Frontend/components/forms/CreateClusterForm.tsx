import axios from "axios";
import { Field, Formik } from "formik";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { Checkbox, TextInput } from "react-native-paper";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";
import { setValue } from "../../utils/form";
import AutocompleteInput from "../inputs/AutocompleteInput";
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
    <Formik initialValues={clusterData} onSubmit={onCreateCluster}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Field as={TextInput} name="name" label="Navn" />
          <Field as={TextInput} name="c5Reference" label="C5 Reference" />
          <Field as={TextInput} name="necessaryPlastic" label="Plastbehov" />
          <Field
            as={TextInput}
            name="usefulPlasticFactor"
            label="Beregningsfaktor"
          />
        </View>
        {/* TODO_SESSION: If the cluser is closed, we need the system to generate a link to invite collectors */}
        <View style={styles.inputContainer}>
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
                    clusterData[selectionData.stateKey],
                    setClusterFormValue(selectionData.stateKey),
                  ]}
                  endpoint={selectionData.usersEndpoint}
                  title={selectionData.title}
                />
              );
            })
          )}
        </View>
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
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
  },
  createBtn: {
    flex: 2,
  },
  autocompleteInputContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 999,
  },
});

export default ClusterCreationForm;
