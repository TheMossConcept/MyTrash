import React, { FC } from "react";
import { Text, View, ViewProps } from "react-native";
import { setValue } from "../utils/form";
import EmailInput from "./InputElements/EmailInput";
import NumericInput from "./InputElements/NumericInput";
import PhoneNumberInput from "./InputElements/PhoneNumberInput";
import StringInput from "./InputElements/StringInput";

export type UserFormData = {
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  streetName?: string;
  city?: string;
  zipCode?: number;
};

type Props = {
  userFormState: [UserFormData, (newValue: UserFormData) => void];
} & ViewProps;

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const UserForm: FC<Props> = ({ userFormState, ...viewProps }) => {
  const [userFormData] = userFormState;

  const {
    email,
    phoneNumber,
    companyName,
    streetName,
    city,
    zipCode,
  } = userFormData;

  const setUserFormValue = setValue(userFormState);

  // TODO: Disable the spreading is forbidden style and spread the view props here!
  return (
    <View style={viewProps.style}>
      <Text>Kontaktoplysninger</Text>
      <EmailInput emailState={[email, setUserFormValue("email")]} />
      <PhoneNumberInput
        phoneNumberState={[phoneNumber, setUserFormValue("phoneNumber")]}
      />
      <Text>Virksomhed</Text>
      <StringInput
        stringState={[companyName, setUserFormValue("companyName")]}
        label="Virksomhedsnavn"
      />
      <Text>Adresse</Text>
      <StringInput
        stringState={[streetName, setUserFormValue("streetName")]}
        label="Gadenavn"
      />
      <StringInput stringState={[city, setUserFormValue("city")]} label="By" />
      <NumericInput
        numberState={[zipCode, setUserFormValue("zipCode")]}
        label="Postnummer"
      />
    </View>
  );
};

export default UserForm;
