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
  street: yup.string().required("Vejnavn er påkrævet"),
  streetNumber: yup.string().required("Gadenummer er påkrævet"),
  city: yup.string().required("By er påkrævet"),
  zipCode: yup.string().required("Postnummer er påkrævet"),
  clusterId: yup.string().required(),
});

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const CollectorForm: FC<Props> = ({
  clusterId,
  submitTitle,
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

  const accessToken = useContext(AccessTokenContext);
  const createUser = (values: CollectorFormData, resetForm: () => void) => {
    if (accessToken) {
      axios
        .post("/CreateUser", values, {
          params: {
            clusterId,
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
        <Subheader>Kontaktoplysninger</Subheader>
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
        {children}
        <SubmitButton title={submitTitle} />
      </View>
    </FormContainer>
  );
};

export default CollectorForm;
