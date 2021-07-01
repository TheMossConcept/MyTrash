import { ErrorMessage, useFormikContext } from "formik";
import React, { PropsWithChildren } from "react";
import { View, ViewStyle, TextInput, Text } from "react-native";
import globalStyles from "../../utils/globalStyles";

type Props<T> = { formKey: keyof T & string; label: string; style?: ViewStyle };

export default function StringField<T>({
  formKey: key,
  label,
  style,
}: PropsWithChildren<Props<T>>) {
  const formikProps = useFormikContext<T>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of StringField. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, handleChange, handleBlur } = formikProps;
    return (
      <View style={style}>
        <TextInput
          /* NB! This is unsafe but I don't know how to statically tell the compiler
          that T should only contain strings */
          value={values[key] as unknown as string}
          onChangeText={handleChange(key)}
          onBlur={handleBlur(key)}
          placeholder={label}
          style={globalStyles.textField}
        />
        <ErrorMessage
          name={key}
          render={(errorMessage) => <Text>{errorMessage}</Text>}
        />
      </View>
    );
  }
}
