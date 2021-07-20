import axios from "axios";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as yup from "yup";
import FormContainer from "../shared/FormContainer";
import StringField from "../inputs/StringField";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import HeadlineText from "../styled/HeadlineText";
import globalStyles from "../../utils/globalStyles";

export type CollectorFormData = {
  clusterId?: string;
  email: string;
  firstName: string;
  lastName: string;
  // This will overflow a 32-bit integer, and therefore, it has to be a string
  phoneNumber: string;
  street: string;
  // This can contain letters as well (e.g. 4A) and therefore, it has to be a string
  streetNumber: string;
  city: string;
  // Eventually, this will become a string as well
  zipCode?: number;
};

type Props = {
  clusterId?: string;
  title: string;
  successCallback?: () => void;
};

const danishPhoneNumberRegExp = new RegExp(
  // eslint-disable-next-line no-control-regex
  /^\d{8}$/
);

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email addressen er ugyldig")
    .required("Email er påkrævet"),
  firstName: yup.string().required("Fornavn er påkrævet"),
  lastName: yup.string().optional(),
  phoneNumber: yup
    .string()
    .matches(danishPhoneNumberRegExp, "Telefonnummeret er ugyldigt"),
  street: yup.string().required("Vejnavn er påkrævet"),
  streetNumber: yup.string().required("Gadenummer er påkrævet"),
  city: yup.string().required("By er påkrævet"),
  zipCode: yup.string().required("Postnummer er påkrævet"),
  clusterId: yup.string().required(),
});

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const CollectorForm: FC<Props> = ({
  clusterId,
  title,
  successCallback,
  children,
}) => {
  // const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const initialValues: CollectorFormData = {
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    street: "",
    streetNumber: "",
    city: "",
    clusterId,
  };

  const sharedAxiosConfig = useAxiosConfig();
  const createUser = (values: CollectorFormData, resetForm: () => void) => {
    axios
      .post("/orchestrators/CreateCollectorAndAddToCluster", values, {
        ...sharedAxiosConfig,
      })
      .then(() => {
        // setShowSnackbar(true);
        resetForm();

        if (successCallback) {
          successCallback();
        }
      });
  };
  // TODO: Disable the spreading is forbidden style and spread the view props here!
  return (
    <FormContainer
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) =>
        createUser(values, formikHelpers.resetForm)
      }
      validateOnMount
    >
      <HeadlineText text={`${title}.`} style={styles.headline} />
      <Text style={globalStyles.subheaderText}>Kontakt.</Text>
      <StringField
        label="Fornavn"
        formKey="firstName"
        style={styles.inputField}
      />
      <StringField
        label="Efternavn"
        formKey="lastName"
        style={styles.inputField}
      />
      <StringField label="Email" formKey="email" style={styles.inputField} />
      <StringField
        label="Telefonnummer"
        formKey="phoneNumber"
        style={styles.inputField}
      />
      <Text style={globalStyles.subheaderText}>Adresse.</Text>
      <View style={[styles.inputField, { flexDirection: "row" }]}>
        <View style={{ flex: 2, marginRight: 10 }}>
          <StringField label="Gadenavn" formKey="street" />
        </View>
        <View style={{ flex: 1 }}>
          <StringField label="Husnummer" formKey="streetNumber" />
        </View>
      </View>
      <StringField label="By" formKey="city" style={styles.inputField} />
      <NumberField
        label="Postnummer"
        formKey="zipCode"
        style={styles.inputField}
      />
      {children}
      <SubmitButton
        title={title}
        icon={{ src: require("../../assets/icons/notepad_grey.png") }}
        isWeb
      />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  headline: {
    alignItems: "flex-start",
  },
  inputField: {
    marginBottom: 23,
  },
  submitButton: {
    marginTop: 10,
  },
});

export default CollectorForm;
