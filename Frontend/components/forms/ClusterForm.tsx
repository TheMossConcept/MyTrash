import * as yup from "yup";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import SelectPartnersForm from "./SelectPartnersForm";
import FormContainer from "../shared/FormContainer";
import StringField from "../inputs/StringField";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import BooleanField from "../inputs/BooleanField";

export type ClusterFormData = {
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

type Props = {
  cluster: ClusterFormData;
  submit: (Cluster: ClusterFormData, reset: () => void) => void;
  submitTitle: string;
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
  productionPartnerId: yup.string().required("Produktionspartner skal vælges"),
});

const ClusterForm: FC<Props> = ({ cluster, submit, submitTitle }) => {
  return (
    <FormContainer
      initialValues={cluster}
      onSubmit={(values, formikHelpers) =>
        submit(values, formikHelpers.resetForm)
      }
      validationSchema={validationSchema}
      validateOnMount
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputColumn}>
            <StringField formKey="name" label="Navn" />
            <StringField formKey="c5Reference" label="C5 Reference" />
            <NumberField formKey="necessaryPlastic" label="Plastbehov" />
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
        <BooleanField formKey="isOpen" label="Åbent cluster" />
        <SubmitButton title={submitTitle} />
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    zIndex: 1,
    minWidth: "80%",
  },
  TextInput: {
    marginBottom: 10,
  },
  inputColumn: {
    flex: 1,
    padding: 10,
  },
});

export default ClusterForm;
