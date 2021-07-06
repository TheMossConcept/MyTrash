import * as yup from "yup";
import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Formik } from "formik";
import SelectPartnersForm from "../user/SelectPartnersForm";
import StringField from "../inputs/StringField";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import BooleanField from "../inputs/BooleanField";
import Container from "../shared/Container";

export type ClusterFormData = {
  isOpen: boolean;
  closedForCollection: boolean;
  name: string;
  c5Reference: string;
  necessaryPlastic?: number;
  usefulPlasticFactor?: number;
  productionPartnerId?: string;
  collectionAdministratorId?: string;
  logisticsPartnerId?: string;
  recipientPartnerId?: string;
};

export type Props = {
  cluster: ClusterFormData;
  clusterId?: string;
  submit?: (Cluster: ClusterFormData, reset: () => void) => void;
  submitTitle?: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Navn skal angives"),
  c5Reference: yup.string(),
  necessaryPlastic: yup.number(),
  usefulPlasticFactor: yup.number().required("Beregningsfaktor skal angives"),
  collectionAdministratorId: yup
    .string()
    .required("Indsamlingsadministrator skal vælges"),
  logisticsPartnerId: yup.string().required("Logistikpartner skal vælges"),
  recipientPartnerId: yup.string().required("Modtagerpartner skal vælges"),
  productionPartnerId: yup.string().required("Produktionspartner skal vælges"),
});

const ClusterForm: FC<Props> = ({
  cluster,
  clusterId,
  submit,
  submitTitle,
}) => {
  let deepLinkUrl = "";
  if (clusterId) {
    // TODO: See if we can do something about the schema hardcoding!
    // TODO: This should probably be in the environment files!
    deepLinkUrl =
      process.env.BLABLA === "production"
        ? `houe-plastic-recycling://tilmeld?clusterId=${clusterId}`
        : `exp://127.0.0.1:19000/--/tilmeld?clusterId=${clusterId}`;
  }
  return (
    <Formik
      initialValues={cluster}
      onSubmit={(values, formikHelpers) => {
        if (submit) {
          submit(values, formikHelpers.resetForm);
        }
      }}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ values }) => (
        <Container>
          <View style={styles.container}>
            <View style={styles.isOpenCheckboxContainer}>
              <BooleanField formKey="isOpen" label="Åbent cluster" />
              {!values.isOpen && deepLinkUrl !== "" && (
                <Text>Invitationslink: {deepLinkUrl}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputColumn}>
                <StringField
                  formKey="name"
                  label="Navn"
                  style={styles.inputField}
                />
                <StringField
                  formKey="c5Reference"
                  label="C5 Reference"
                  style={styles.inputField}
                />
                <NumberField
                  formKey="necessaryPlastic"
                  label="Målsætning"
                  style={styles.inputField}
                />
                <NumberField
                  formKey="usefulPlasticFactor"
                  label="Beregningsfaktor"
                />
              </View>
              {/* TODO_SESSION: If the cluser is closed, we need the system to generate a link to invite collectors */}
              <View style={styles.inputColumn}>
                <SelectPartnersForm />
              </View>
            </View>
            {submit && <SubmitButton title={submitTitle || "Indsend"} />}
          </View>
        </Container>
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
    width: "95%",
  },
  inputContainer: {
    flexDirection: "row",
    zIndex: 1,
    width: "95%",
  },
  inputColumn: {
    flex: 1,
    padding: 10,
  },
  isOpenCheckboxContainer: {
    alignItems: "flex-start",
    width: "95%",
  },
  inputField: {
    marginBottom: 5,
  },
});

export default ClusterForm;
