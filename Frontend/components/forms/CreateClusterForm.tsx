import axios from "axios";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import React, { FC, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Checkbox, TextInput } from "react-native-paper";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";
import { setValue } from "../../utils/form";
import AutocompleteInput from "../inputs/AutocompleteInput";
import DismissableSnackbar from "../shared/DismissableSnackbar";

type ClusterCreationFormData = {
  isOpen: boolean;
  name: string;
  c5Reference: string;
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

type Props = { onCreation?: () => void };

const ClusterCreationForm: FC<Props> = ({ onCreation }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const initialValues: ClusterCreationFormData = {
    name: "",
    isOpen: false,
    c5Reference: "",
    logisticsPartnerId: "",
    recipientPartnerId: "",
    productionPartnerId: "",
    collectionAdministratorId: "",
  };

  const accessToken = useContext(AccessTokenContext);

  // Only run data fetch once, otherwise the state update of an
  // array will cause an infinite reload because it is a new instance
  // each time
  // TODO: Factor all this out into its own component!!
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

  const createCluster = (values: ClusterCreationFormData) => {
    if (accessToken) {
      axios
        .post("/CreateCluster", values, {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then(() => {
          setShowSuccessSnackbar(true);
          if (onCreation) {
            onCreation();
          }
        });
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Navn skal angives"),
    c5Reference: yup.string().required("C5 reference skal angives"),
    necessaryPlastic: yup.number().required("Plastbehov skal angives"),
    usefulPlasticFactor: yup.number().required("Beregningsfaktor skal angives"),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => createCluster(values)}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({
        handleSubmit,
        handleBlur,
        handleChange,
        values,
        isValid,
        setFieldValue,
      }) => (
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.inputColumn}>
              <TextInput
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                label="Navn"
              />
              <ErrorMessage name="name" />
              <TextInput
                onChangeText={handleChange("c5Reference")}
                onBlur={handleBlur("c5Reference")}
                value={values.c5Reference}
                label="C5 Reference"
              />
              <ErrorMessage name="c5Reference" />
              <TextInput
                onChangeText={handleChange("necessaryPlastic")}
                onBlur={handleBlur("necessaryPlastic")}
                value={values.necessaryPlastic?.toString() || ""}
                label="Plastbehov"
              />
              <ErrorMessage name="necessaryPlastic" />
              <TextInput
                onChangeText={handleChange("usefulPlasticFactor")}
                onBlur={handleBlur("usefulPlasticFactor")}
                keyboardType="numeric"
                value={values.usefulPlasticFactor?.toString() || ""}
                label="Beregningsfaktor"
              />
              <ErrorMessage name="usefulPlasticFactor" />
            </View>
            {/* TODO_SESSION: If the cluser is closed, we need the system to generate a link to invite collectors */}
            <View style={styles.inputColumn}>
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
                          setFieldValue(selectionData.stateKey, newValue, true),
                      ]}
                      endpoint={selectionData.usersEndpoint}
                      title={selectionData.title}
                    />
                  );
                })
              )}
            </View>
          </View>
          <Text>Åbent cluster</Text>
          <Checkbox
            status={values.isOpen ? "checked" : "unchecked"}
            onPress={() => setFieldValue("isOpen", !values.isOpen)}
          />
          <Button
            title="Opret cluster"
            disabled={!isValid}
            onPress={() => handleSubmit()}
          />
          <DismissableSnackbar
            title="Clusteret blev oprettet"
            showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    zIndex: 1,
  },
  inputColumn: {
    flex: 1,
    padding: 5,
  },
});

export default ClusterCreationForm;
