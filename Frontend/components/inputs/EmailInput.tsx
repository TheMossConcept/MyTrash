import React, { FC, useState } from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { ValidationResult, validateString } from "../../utils/form";

type Props = {
  emailState: [string | undefined, (newValue: string | undefined) => void];
  isOptional?: boolean;
};

const EmailInput: FC<Props> = ({ emailState, isOptional }) => {
  const [email, setEmail] = emailState;
  const [textInputValue, setTextInputValue] = useState(email);
  const [validationError, setValidationError] = useState<string>();

  const setEmailWrapper = (newValue: string) => {
    // Make sure the UI is always updated with the latest input
    setTextInputValue(newValue);

    // I got the regexp from here https://emailregex.com/
    const emailRegExp = new RegExp(
      // eslint-disable-next-line no-control-regex
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    );

    const validationResult = validateString(newValue, emailRegExp, isOptional);

    switch (validationResult) {
      case ValidationResult.missing:
        setEmail(undefined);
        setValidationError("En email addresse er påkrævet");
        break;

      case ValidationResult.invalid:
        setEmail(undefined);
        setValidationError("Ugyldig email");
        break;

      case ValidationResult.success:
        setEmail(newValue);
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
        onChangeText={setEmailWrapper}
        error={hasValidationError}
        label="Email"
        keyboardType="email-address"
      />
      <HelperText type="error" visible={hasValidationError}>
        {validationError}
      </HelperText>
    </View>
  );
};

export default EmailInput;
