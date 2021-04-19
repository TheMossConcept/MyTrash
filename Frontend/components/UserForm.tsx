import React, { FC, useEffect, useState } from "react";
import { Text, TextInput, View, ViewProps } from "react-native";

export type UserFormData = {
  email: string;
  phoneNumber: number;
  companyName: string;
  debitorNumber: number;
  streetName: string;
  city: string;
  zipCode: number;
};

type Props = {
  handleUserDataChange: (data: UserFormData | null) => void;
} & ViewProps;

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const UserForm: FC<Props> = ({ handleUserDataChange, ...viewProps }) => {
  // TODO: Add value types here for email and phone number and possibly zipCode with proper validation!
  const [email, setEmail] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<number>();

  const [companyName, setCompanyName] = useState<string>();
  const [debitorNumber, setDebitorNumber] = useState<number>();

  const [streetName, setStreetName] = useState<string>();
  const [city, setCity] = useState<string>();
  const [zipCode, setZipCode] = useState<number>();

  const numericWrapper = (
    setter: (newNumericValue: number | undefined) => void
  ) => (newValue: string) => {
    const newNumericValue = Number.parseInt(newValue, 10) || undefined;
    setter(newNumericValue);
  };

  useEffect(() => {
    if (
      email &&
      phoneNumber &&
      companyName &&
      debitorNumber &&
      streetName &&
      city &&
      zipCode
    ) {
      handleUserDataChange({
        email,
        phoneNumber,
        companyName,
        debitorNumber,
        streetName,
        city,
        zipCode,
      });
    } else {
      handleUserDataChange(null);
    }
  }, [
    email,
    phoneNumber,
    companyName,
    debitorNumber,
    streetName,
    city,
    zipCode,
  ]);

  // TODO: Disable the spreading is forbidden style and spread the view props here!
  return (
    <View style={viewProps.style}>
      <Text>Kontaktoplysninger</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput
        value={phoneNumber?.toString()}
        onChangeText={numericWrapper(setPhoneNumber)}
        placeholder="Telefonnummer"
      />
      <Text>Virksomhed</Text>
      <TextInput
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Firmanavn"
      />
      <TextInput
        value={debitorNumber?.toString()}
        onChangeText={numericWrapper(setDebitorNumber)}
        keyboardType="numeric"
        placeholder="Debitornummer"
      />
      <Text>Adresse</Text>
      <TextInput
        value={streetName}
        onChangeText={setStreetName}
        placeholder="Gadenavn"
      />
      <TextInput value={city} onChangeText={setCity} placeholder="By" />
      <TextInput
        value={zipCode?.toString()}
        onChangeText={numericWrapper(setZipCode)}
        placeholder="Postnummer"
      />
    </View>
  );
};

export default UserForm;
