import axios from "axios";
import React, { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as yup from "yup";
import FormContainer from "../shared/FormContainer";
import StringField from "../inputs/StringField";
import NumberField from "../inputs/NumberField";
import Subheader from "../styled/Subheader";
import SubmitButton from "../inputs/SubmitButton";
import RoleSelector from "./RoleSelector";
import useAppRoles from "../../hooks/useAppRoles";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import HeadlineText from "../styled/HeadlineText";

export type UserFormData = {
  email: string;
  firstName: string;
  lastName: string;
  // This will overflow a 32-bit integer, and therefore, it has to be a string
  phoneNumber: string;
  companyName: string;
  street: string;
  // This can contain letters as well (e.g. 4A) and therefore, it has to be a string
  streetNumber: string;
  city: string;
  // Eventually, this will become a string as well
  zipCode?: number;
  role: string;
};

type Props = {
  submitTitle: string;
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
  companyName: yup.string().optional(),
  street: yup.string().required("Vejnavn er påkrævet"),
  streetNumber: yup.string().required("Gadenummer er påkrævet"),
  city: yup.string().required("By er påkrævet"),
  zipCode: yup.string().required("Postnummer er påkrævet"),
  role: yup.string().required("Rolle er påkrævet"),
});

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const CollaboratorForm: FC<Props> = ({ submitTitle, successCallback }) => {
  // const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const initialValues: UserFormData = {
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    phoneNumber: "",
    street: "",
    streetNumber: "",
    city: "",
    role: "",
  };

  const sharedAxiosConfig = useAxiosConfig();
  const createUser = (values: UserFormData, resetForm: () => void) => {
    axios
      .post("/CreateCollaborator", values, {
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

  const { appRoles } = useAppRoles();

  // Empty array as we do not select app roles for non-partner users
  const appRolesForSelection = appRoles.filter(
    (appRole) => appRole.id !== "Collector"
  );

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
      <HeadlineText
        text="Inviter partner."
        style={{ alignItems: "flex-start" }}
      />
      <StringField
        label="Virksomhedsnavn"
        formKey="companyName"
        style={styles.field}
      />
      <Text style={styles.subheaderText}>Kontaktperson. </Text>
      <StringField label="Fornavn" formKey="firstName" style={styles.field} />
      <StringField label="Efternavn" formKey="lastName" style={styles.field} />
      <StringField label="Email" formKey="email" style={styles.field} />
      <StringField
        label="Telefonnummer"
        formKey="phoneNumber"
        style={styles.field}
      />
      <Text style={styles.subheaderText}>Addresseoplysninger.</Text>
      <View style={styles.streetAddressField}>
        <View style={{ flex: 2 }}>
          <StringField
            label="Gadenavn"
            formKey="street"
            style={styles.streetNameField}
          />
        </View>
        <View style={{ flex: 1 }}>
          <StringField label="Husnummer" formKey="streetNumber" />
        </View>
      </View>
      <StringField label="By" formKey="city" style={styles.field} />
      <NumberField label="Postnummer" formKey="zipCode" style={styles.field} />
      <RoleSelector formKey="role" appRoles={appRolesForSelection} />
      <SubmitButton title={submitTitle} style={styles.submitButton} isWeb />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 23,
  },
  submitButton: {
    marginTop: 23,
  },
  streetAddressField: {
    flexDirection: "row",
    marginBottom: 23,
  },
  streetNameField: {
    marginRight: 12,
  },
  subheaderText: {
    fontSize: 20,
    color: "#898c8e",
    marginLeft: 11,
    fontFamily: "HelveticaNeueLTPro-Bd",
    wordBreak: "break-word",
  },
});

export default CollaboratorForm;
