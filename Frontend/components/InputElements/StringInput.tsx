import React, { FC, useState } from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { ValidationResult, validateString } from "../../utils/form";

type Props = {
  stringState: [string | undefined, (newValue: string | undefined) => void];
  label: string;
  isOptional?: boolean;
};

const StringInput: FC<Props> = ({ stringState, isOptional, label }) => {
  const [stringValue, setStringValue] = stringState;
  const [textInputValue, setTextInputValue] = useState(stringValue);
  const [validationError, setValidationError] = useState<string>();

  const setEmailWrapper = (newValue: string) => {
    // Make sure the UI is always updated with the latest input
    setTextInputValue(newValue);

    // I got the regexp from here https://emailregex.com/
    const stringRegExp = new RegExp(
      // eslint-disable-next-line no-control-regex
      /^([a-z]|æ|ø|å)*$/i
    );

    const validationResult = validateString(newValue, stringRegExp, isOptional);

    switch (validationResult) {
      case ValidationResult.missing:
        setStringValue(undefined);
        setValidationError("Værdien er påkrævet");
        break;

      case ValidationResult.invalid:
        setStringValue(undefined);
        setValidationError("Kun tekst er tilladt");
        break;

      case ValidationResult.success:
        setStringValue(newValue);
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
        label={label}
      />
      <HelperText type="error" visible={hasValidationError}>
        {validationError}
      </HelperText>
    </View>
  );
};

export default StringInput;
