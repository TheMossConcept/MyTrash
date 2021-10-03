import { ErrorMessage, useFormikContext } from "formik";
import React, { PropsWithChildren, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Keyboard,
} from "react-native";
import useOutsideClickDetector from "../../hooks/useOutsideClickDetector";
import globalStyles from "../../utils/globalStyles";

type Props<T> = { formKey: keyof T & string; label: string } & TextInputProps;

// TODO: Make this less funky! And fix the issue when the first character is greater than 1!
export default function NumberField<T>({
  formKey: key,
  label,
  style,
  ...textInputProps
}: PropsWithChildren<Props<T>>) {
  // Somewhat hacky, but it seems like the path of least resistance in order to support floating
  // numbers without making the UI and form state inconsistent and without allowing strings to be
  // passed on as numbers
  const formikProps = useFormikContext<T>();

  const ref = useRef(null);
  useOutsideClickDetector(ref, () => {
    Keyboard.dismiss();
  });

  if (!formikProps) {
    throw Error(
      "Incorrect use of NumberField. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, setFieldValue, handleBlur } = formikProps;
    const handleNumberChange = (field: string) => (newValue: string) => {
      if (newValue === "") {
        setFieldValue(field, undefined);
      } else {
        const integerValue = Number.parseInt(newValue, 10);

        if (!Number.isNaN(integerValue)) {
          setFieldValue(field, integerValue);
        }
      }
    };

    const value = values
      ? (values[key] as unknown as number)?.toString() || ""
      : "";

    return (
      <View style={style}>
        <Text style={[globalStyles.subheaderText, styles.labelText]}>
          {label}
        </Text>
        <TextInput
          placeholder={label}
          placeholderTextColor="#a3a5a8"
          style={globalStyles.textField}
          /* NB! This is unsafe but I don't know how to statically tell the compiler
          that T should only contain strings */
          value={value}
          ref={ref}
          onChangeText={handleNumberChange(key)}
          onBlur={handleBlur(key)}
          {...textInputProps}
        />
        <ErrorMessage
          name={key}
          render={(errorMessage) => <Text>{errorMessage}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelText: { fontSize: 12 },
});
