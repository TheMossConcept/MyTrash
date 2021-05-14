import axios from "axios";
import React, { FC, useContext } from "react";
import { View } from "react-native";
import * as yup from "yup";
import axiosUtils from "../../utils/axios";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import FormContainer from "../shared/FormContainer";
import StringField from "../inputs/StringField";
import NumberField from "../inputs/NumberField";
import Subheader from "../styled/Subheader";
import SubmitButton from "../inputs/SubmitButton";
import RoleSelector from "../RoleSelector";
import useAppRoles from "../../hooks/useAppRoles";

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
  isPartner: boolean;
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
const UserForm: FC<Props> = ({ isPartner, submitTitle, successCallback }) => {
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
    role: isPartner ? "" : "Collector",
  };

  const accessToken = useContext(AccessTokenContext);
  const createUser = (values: UserFormData, resetForm: () => void) => {
    if (accessToken) {
      axios
        .post("/CreateUser", values, {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then(() => {
          // setShowSnackbar(true);
          resetForm();

          if (successCallback) {
            successCallback();
          }
        });
    }
  };

  const { appRoles } = useAppRoles();

  // Empty array as we do not select app roles for non-partner users
  const appRolesForSelection = isPartner
    ? appRoles.filter((appRole) => appRole.id !== "Collector")
    : [];

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
      <View style={{ width: "95%", margin: "auto" }}>
        {isPartner ? (
          <StringField label="Virksomhedsnavn" formKey="companyName" />
        ) : null}
        <Subheader>
          {isPartner ? "Kontaktperson" : "Kontaktoplysninger"}
        </Subheader>
        <StringField label="Fornavn" formKey="firstName" />
        <StringField label="Efternavn" formKey="lastName" />
        <StringField label="Email" formKey="email" />
        <StringField label="Telefonnummer" formKey="phoneNumber" />
        <Subheader>Addresseoplysninger</Subheader>
        <View style={{ flex: 2 }}>
          <StringField label="Gadenavn" formKey="street" />
        </View>
        <View style={{ flex: 1 }}>
          <StringField label="Husnummer" formKey="streetNumber" />
        </View>
        <StringField label="By" formKey="city" />
        <NumberField label="Postnummer" formKey="zipCode" />
        {isPartner && (
          <RoleSelector formKey="role" appRoles={appRolesForSelection} />
        )}
        <SubmitButton title={submitTitle} />
      </View>
    </FormContainer>
  );
};

export default UserForm;
