import { ErrorMessage, useFormikContext } from "formik";
import React, { PropsWithChildren } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

type Props<T> = { formKey: keyof T & string; label: string };

export default function BooleanField<T>({
  formKey: key,
  label,
}: PropsWithChildren<Props<T>>) {
  const formikProps = useFormikContext<T>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of BooleanField. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, setFieldValue } = formikProps;
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <Checkbox
          status={values[key] ? "checked" : "unchecked"}
          onPress={() => setFieldValue(key, !values[key])}
        />
        <ErrorMessage name={key} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    padding: 6,
    paddingBottom: 0,
    fontSize: 10,
    fontWeight: "800",
    color: "white",
  },
});
