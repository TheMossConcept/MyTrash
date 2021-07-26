import * as yup from "yup";
import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Formik } from "formik";
import Constants from "expo-constants";
import SelectPartnersForm from "../user/SelectPartnersForm";
import StringField from "../inputs/StringField";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import BooleanField from "../inputs/BooleanField";
import HeadlineText from "../styled/HeadlineText";

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
  title?: string;
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

const ClusterForm: FC<Props> = ({ cluster, clusterId, submit, title }) => {
  let deepLinkUrl = "";
  if (clusterId) {
    const { MOBILE_REDIRECT_URL } = Constants.manifest.extra || {};
    // TODO: See if we can do something about the schema hardcoding!
    // TODO: This should probably be in the environment files!
    deepLinkUrl = `${MOBILE_REDIRECT_URL}/tilmeld?clusterId=${clusterId}`;
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
        <View style={styles.container}>
          <HeadlineText
            text={`${title}.`}
            style={{ alignItems: "flex-start" }}
          />
          <StringField formKey="name" label="Navn" style={styles.inputField} />
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
            style={styles.inputField}
          />
          <SelectPartnersForm style={styles.selectPartnersForm} />
          <View style={styles.isOpenCheckboxContainer}>
            <BooleanField formKey="isOpen" label="Åbent cluster" />
            {!values.isOpen && deepLinkUrl !== "" && (
              <Text>Invitationslink: {deepLinkUrl}</Text>
            )}
          </View>
          {submit && <SubmitButton title={title || "Indsend"} isWeb />}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  isOpenCheckboxContainer: {
    alignItems: "flex-start",
    marginBottom: 23,
    // TODO: This should automatically be handled by the AutocompleteInput instead!
    zIndex: -1,
  },
  inputField: {
    marginBottom: 23,
  },
  selectPartnersForm: {
    marginBottom: 23,
  },
});

export default ClusterForm;
