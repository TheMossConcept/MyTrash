import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { ValidationResult, validateString } from "../../utils/form";

type Props = {
  numberState: [number | undefined, (newValue: number | undefined) => void];
  label: string;
  isOptional?: boolean;
};

const NumericInput: FC<Props> = ({ numberState, isOptional, label }) => {
  const [numericValue, setNumericValue] = numberState;
  const [textInputValue, setTextInputValue] = useState(
    numericValue?.toString() || null
  );
  useEffect(() => {
    setTextInputValue(numericValue?.toString() || null);
  }, [numericValue]);
  const [validationError, setValidationError] = useState<string>();

  const setNumericValueWrapper = (newValue: string) => {
    // Make sure the UI is always updated with the latest input
    setTextInputValue(newValue);

    // I got the regexp from here https://emailregex.com/
    const numericRegExp = new RegExp(
      // eslint-disable-next-line no-control-regex
      /^[\d|.]*$/
    );

    const validationResult = validateString(
      newValue,
      numericRegExp,
      isOptional
    );

    switch (validationResult) {
      case ValidationResult.missing:
        setNumericValue(undefined);
        setValidationError("Værdien er påkrævet");
        break;

      case ValidationResult.invalid:
        setNumericValue(undefined);
        setValidationError("Kun tal er tilladt");
        break;

      case ValidationResult.success:
        // Here, we know this should succeed because it passed the validation
        setNumericValue(Number.parseInt(newValue, 10));
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
        value={textInputValue || ""}
        keyboardType="numeric"
        onChangeText={setNumericValueWrapper}
        error={hasValidationError}
        label={label}
      />
      <HelperText type="error" visible={hasValidationError}>
        {validationError}
      </HelperText>
    </View>
  );
};

export default NumericInput;
