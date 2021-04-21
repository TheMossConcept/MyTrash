import React, { FC } from "react";
import { Text, TextInput, View, ViewProps } from "react-native";
import EmailInput from "./InputElements/EmailInput";

export type UserFormData = {
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  debitorNumber?: number;
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
    debitorNumber,
    streetName,
    city,
    zipCode,
  } = userFormData;

  const setValue = (key: keyof UserFormData) => (
    value: string | number | undefined
  ) => {
    const existingValue = userFormData[key];
    // Update the value if it has changed
    if (existingValue !== value) {
      setUserFormData({ ...userFormData, [key]: value });
    }
  };

  // TODO: Disable the spreading is forbidden style and spread the view props here!
  return (
    <View style={viewProps.style}>
      <Text>Kontaktoplysninger</Text>
      <EmailInput emailState={[email, setValue("email")]} />
      <TextInput
        value={phoneNumber?.toString()}
        onChangeText={setValue("phoneNumber")}
        placeholder="Telefonnummer"
      />
      <Text>Virksomhed</Text>
      <TextInput
        value={companyName}
        onChangeText={setValue("companyName")}
        placeholder="Firmanavn"
      />
      <TextInput
        value={debitorNumber?.toString()}
        onChangeText={setValue("debitorNumber")}
        keyboardType="numeric"
        placeholder="Debitornummer"
      />
      <Text>Adresse</Text>
      <TextInput
        value={streetName}
        onChangeText={setValue("streetName")}
        placeholder="Gadenavn"
      />
      <TextInput
        value={city}
        onChangeText={setValue("city")}
        placeholder="By"
      />
      <TextInput
        value={zipCode?.toString()}
        onChangeText={setValue("zipCode")}
        placeholder="Postnummer"
      />
    </View>
  );
};

export default UserForm;
