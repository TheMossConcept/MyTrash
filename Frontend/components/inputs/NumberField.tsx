import { ErrorMessage, useFormikContext } from "formik";
import React, { PropsWithChildren, useState } from "react";
import { View, ViewStyle, TextInput, Text, StyleSheet } from "react-native";
import globalStyles from "../../utils/globalStyles";

type Props<T> = { formKey: keyof T & string; label: string; style?: ViewStyle };

// TODO: Make this less funky! And fix the issue when the first character is greater than 1!
export default function NumberField<T>({
  formKey: key,
  label,
  style,
}: PropsWithChildren<Props<T>>) {
  // Somewhat hacky, but it seems like the path of least resistance in order to support floating
  // numbers without making the UI and form state inconsistent and without allowing strings to be
  // passed on as numbers
  const [firstPartOfFloat, setFirstPartOfFloat] = useState<
    string | undefined
  >();
  const formikProps = useFormikContext<T>();

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
        const lastCharacterOfNewValue = newValue.charAt(newValue.length - 1);

        const valueToParse = firstPartOfFloat
          ? `${firstPartOfFloat}${lastCharacterOfNewValue}`
          : newValue;
        const floatValue = Number.parseFloat(valueToParse);

        if (!Number.isNaN(floatValue)) {
          setFieldValue(field, floatValue);
        }

        if (lastCharacterOfNewValue === ".") {
          setFirstPartOfFloat(newValue);
        } else {
          setFirstPartOfFloat(undefined);
        }
      }
    };

    // TODO: Do NOT try to handle floating point numbers here!
    const value =
      firstPartOfFloat || (values[key] as unknown as number)?.toString() || "";

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
          onChangeText={handleNumberChange(key)}
          onBlur={handleBlur(key)}
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
