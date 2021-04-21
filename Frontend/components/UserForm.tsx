import React, { FC, useEffect } from "react";
import { Text, View, ViewProps } from "react-native";
import EmailInput from "./InputElements/EmailInput";
import NumericInput from "./InputElements/NumericInput";
import PhoneNumberInput from "./InputElements/PhoneNumberInput";
import StringInput from "./InputElements/StringInput";

export type UserFormData = {
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  debitorNumber?: string;
  streetName?: string;
  city?: string;
  zipCode?: number;
};

type Props = {
  userFormState: [UserFormData, (newValue: UserFormData) => void];
} & ViewProps;

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const UserForm: FC<Props> = ({ userFormState, ...viewProps }) => {
  const [userFormData, setUserFormData] = userFormState;

  const {
    email,
    phoneNumber,
    companyName,
    streetName,
    city,
    zipCode,
  } = userFormData;

  const setValue = (key: keyof UserFormData) => (
    value: string | number | undefined
  ) => {
    const existingValue = userFormData[key];
    // Update the value if it has changed
    /*
    if (value === undefined) {
      setUserFormData({ ...userFormData, [key]: undefined });
    }
    */
    if (existingValue !== value) {
      setUserFormData({ ...userFormData, [key]: value });
    }
  };

  useEffect(() => {
    console.log(`UserFormData changed to: ${JSON.stringify(userFormData)}`);
  }, [userFormData]);

  // TODO: Disable the spreading is forbidden style and spread the view props here!
  return (
    <View style={viewProps.style}>
      <Text>Kontaktoplysninger</Text>
      <EmailInput emailState={[email, setValue("email")]} />
      <PhoneNumberInput
        phoneNumberState={[phoneNumber, setValue("phoneNumber")]}
      />
      <Text>Virksomhed</Text>
      <StringInput
        stringState={[companyName, setValue("companyName")]}
        label="Virksomhedsnavn"
      />
      <Text>Adresse</Text>
      <StringInput
        stringState={[streetName, setValue("streetName")]}
        label="Gadenavn"
      />
      <StringInput stringState={[city, setValue("city")]} label="By" />
      <NumericInput
        numberState={[zipCode, setValue("zipCode")]}
        label="Postnummer"
      />
    </View>
  );
};

export default UserForm;
