import { ErrorMessage, useFormikContext } from "formik";
import React, { PropsWithChildren } from "react";
import { View, ViewStyle, TextInput, Text, TextInputProps } from "react-native";
import globalStyles from "../../utils/globalStyles";

type Props<T> = {
  formKey: keyof T & string;
  label: string;
  style?: ViewStyle;
} & Omit<TextInputProps, "style">;

export default function StringField<T>({
  formKey: key,
  label,
  style,
  ...textInputProps
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
          placeholderTextColor="#a3a5a8"
          style={globalStyles.textField}
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
