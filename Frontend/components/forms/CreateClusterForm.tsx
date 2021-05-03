import axios from "axios";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import React, { FC, useContext, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Checkbox, TextInput } from "react-native-paper";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";
import DismissableSnackbar from "../shared/DismissableSnackbar";
import SelectPartnersForm from "./SelectPartnersForm";

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

type Props = { onCreation?: () => void };

const ClusterCreationForm: FC<Props> = ({ onCreation }) => {
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
    collectionAdministratorId: yup
      .string()
      .required("Indsamlingsadministrator skal vælges"),
    logisticsPartnerId: yup.string().required("Logistikpartner skal vælges"),
    recipientPartnerId: yup.string().required("Modtagerpartner skal vælges"),
    productionPartnerId: yup
      .string()
      .required("Produktionspartner skal vælges"),
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
      }) => {
        const setPartnersValues = (field: string, value: any) =>
          setFieldValue(field, value, true);

        return (
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
                <SelectPartnersForm
                  values={values}
                  setValues={setPartnersValues}
                />
                <ErrorMessage name="collectionAdministratorId" />
                <ErrorMessage name="logisticsPartnerId" />
                <ErrorMessage name="recipientPartnerId" />
                <ErrorMessage name="productionPartnerId" />
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
        );
      }}
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