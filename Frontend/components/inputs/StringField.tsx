import { ErrorMessage, useFormikContext } from "formik";
import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

type Props<T> = { formKey: keyof T & string; label: string };

export default function StringField<T>({
  formKey: key,
  label,
}: PropsWithChildren<Props<T>>) {
  const formikProps = useFormikContext<T>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of StringField. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, handleChange, handleBlur } = formikProps;
    return (
      <View>
        <TextInput
          /* NB! This is unsafe but I don't know how to statically tell the compiler
          that T should only contain strings */
          value={(values[key] as unknown) as string}
          onChangeText={handleChange(key)}
          onBlur={handleBlur(key)}
          label={label}
        />
        <ErrorMessage name={key} />
      </View>
    );
  }
}
