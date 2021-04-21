import React, { FC, useState } from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";

type Props = {
  emailState: [string | undefined, (newValue: string | undefined) => void];
};

const EmailInput: FC<Props> = ({ emailState }) => {
  const [email, setEmail] = emailState;
  const [textInputValue, setTextInputValue] = useState(email);
  const [validationError, setValidationError] = useState<string | undefined>();

  const setEmailWrapper = (newValue: string) => {
    // Make sure the UI is always updated with the latest input
    setTextInputValue(newValue);
    // I got the regexp from here https://emailregex.com/
    const emailRegExp = new RegExp(
      // eslint-disable-next-line no-control-regex
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    );

    // Only pass the value up the component chain if it is valid
    if (emailRegExp.test(newValue)) {
      setValidationError(undefined);
      setEmail(newValue);
    } else {
      setValidationError("Invalid email");
      setEmail(undefined);
    }
  };

  return (
    <View>
      <TextInput
        value={textInputValue}
        onChangeText={setEmailWrapper}
        label="Email"
      />
      <HelperText type="error" visible={validationError !== undefined}>
        {validationError}
      </HelperText>
    </View>
  );
};

export default EmailInput;
