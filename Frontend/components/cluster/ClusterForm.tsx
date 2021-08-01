import * as yup from "yup";
import React, { FC, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Formik } from "formik";
import * as Linking from "expo-linking";
import Clipboard from "expo-clipboard";
import SelectPartnersForm from "../user/SelectPartnersForm";
import StringField from "../inputs/StringField";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import BooleanField from "../inputs/BooleanField";
import HeadlineText from "../styled/HeadlineText";
import MobileButton from "../styled/MobileButton";
import GlobalSnackbarContext from "../../utils/globalContext";

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
  const showSnackbar = useContext(GlobalSnackbarContext);

  let invitationLinkUrl = "";
  if (clusterId) {
    // TODO: See if we can do something about the schema hardcoding!
    // TODO: This should probably be in the environment files!
    invitationLinkUrl = Linking.createURL("/invitation", {
      queryParams: { clusterId },
    });
  }

  const copyInvitationLinkToClipboard = () => {
    Clipboard.setString(invitationLinkUrl);
    showSnackbar("Invitationslinket er kopireret");
  };

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
            {!values.isOpen && invitationLinkUrl !== "" && (
              <View style={styles.invitationLinkContainer}>
                <MobileButton
                  icon={{
                    src: require("../../assets/icons/copy.png"),
                    width: 34,
                    height: 34,
                  }}
                  style={{ marginRight: 23 }}
                  onPress={copyInvitationLinkToClipboard}
                />
                <Text style={styles.invitationLinkText}>
                  Invitationslink: {invitationLinkUrl}
                </Text>
              </View>
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
  invitationLinkContainer: {
    flexDirection: "row",
    marginTop: 23,
    alignItems: "center",
  },
  invitationLinkText: {
    color: "#a3a5a8",
    fontFamily: "HelveticaNeueLTPro-Bd",
    fontSize: 16,
  },
});

export default ClusterForm;
