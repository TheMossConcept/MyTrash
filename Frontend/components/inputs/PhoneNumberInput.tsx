import React, { FC, useState } from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { ValidationResult, validateString } from "../../utils/form";

type Props = {
  phoneNumberState: [
    string | undefined,
    (newValue: string | undefined) => void
  ];
  isOptional?: boolean;
};

const PhoneNumberInput: FC<Props> = ({ phoneNumberState, isOptional }) => {
  const [phoneNumber, setPhoneNumber] = phoneNumberState;
  const [textInputValue, setTextInputValue] = useState(phoneNumber);
  const [validationError, setValidationError] = useState<string>();

  const setPhoneNumberWrapper = (newValue: string) => {
    // Make sure the UI is always updated with the latest input
    setTextInputValue(newValue);

    const danishPhoneNumberRegExp = new RegExp(
      // eslint-disable-next-line no-control-regex
      /^\d{8}$/
    );

    const validationResult = validateString(
      newValue,
      danishPhoneNumberRegExp,
      isOptional
    );

    switch (validationResult) {
      case ValidationResult.missing:
        setPhoneNumber(undefined);
        setValidationError("Et telefonnummer er påkrævet");
        break;

      case ValidationResult.invalid:
        setPhoneNumber(undefined);
        setValidationError("Ugyldigt telefonnummer");
        break;

      case ValidationResult.success:
        setPhoneNumber(newValue);
        setValidationError(undefined);
        break;
      default:
        /* eslint-disable-next-line no-console */
        console.warn("In default case for validation result!");
    }
  };

  const hasValidationError = validationError !== undefined;

  return (
    <View>
      <TextInput
        value={textInputValue}
        onChangeText={setPhoneNumberWrapper}
        error={hasValidationError}
        keyboardType="phone-pad"
        label="Telefonnummer"
      />
      <HelperText type="error" visible={hasValidationError}>
        {validationError}
      </HelperText>
    </View>
  );
};

export default PhoneNumberInput;
