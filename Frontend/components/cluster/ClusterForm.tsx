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
import LoadingIndicator from "../styled/LoadingIndicator";

export type ClusterFormData = {
  open: boolean;
  closedForCollection: boolean;
  name: string;
  c5Reference: string;
  necessaryAmountOfPlastic?: number;
  usefulPlasticFactor?: number;
  productionPartnerId?: string;
  collectionAdministratorId?: string;
  logisticsPartnerId?: string;
  recipientPartnerId?: string;
};

export type Props = {
  cluster: ClusterFormData & { closedForCollection: boolean };
  clusterId?: string;
  submit?: (Cluster: ClusterFormData, reset: () => void) => void;
  title?: string;
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Navn skal angives"),
  c5Reference: yup.string(),
  necessaryPlastic: yup.number(),
  usefulPlasticFactor: yup
    .number()
    .min(1, "Genanvendelsesprocenten skal minimum være 1")
    .max(100, "Genanvendelsesprocenten kan maksimalt være 100")
    .required("Genanvendelsesprocent skal angives"),
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

  const editable = !cluster.closedForCollection;

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
      {({ values, isSubmitting }) => (
        <View style={styles.container}>
          {title && (
            <HeadlineText
              text={`${title}.`}
              style={{ alignItems: "flex-start" }}
            />
          )}
          <StringField
            formKey="name"
            label="Navn"
            style={styles.inputField}
            editable={editable}
          />
          <StringField
            formKey="c5Reference"
            label="C5 Reference"
            style={styles.inputField}
            editable={editable}
          />
          <NumberField
            formKey="necessaryAmountOfPlastic"
            label="Målsætning i kg"
            style={styles.inputField}
            editable={editable}
          />
          <NumberField
            formKey="usefulPlasticFactor"
            label="Genanvendelsesprocent"
            style={styles.inputField}
            editable={editable}
          />
          <SelectPartnersForm
            style={styles.selectPartnersForm}
            editable={editable}
          />
          <View style={styles.isOpenCheckboxContainer}>
            <BooleanField
              formKey="open"
              label="Åbent cluster"
              enabled={editable}
            />
            {!values.open && invitationLinkUrl !== "" && (
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
          {isSubmitting && <LoadingIndicator />}
          {submit && (
            <SubmitButton
              title={title || "Indsend"}
              style={styles.submitButton}
              isWeb
            />
          )}
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
  submitButton: {
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
