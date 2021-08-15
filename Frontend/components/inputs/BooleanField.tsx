import { ErrorMessage, useFormikContext } from "formik";
import React, { PropsWithChildren } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  Image,
} from "react-native";

type Props<T> = {
  formKey: keyof T & string;
  label: string;
  enabled?: boolean;
} & ViewProps;

export default function BooleanField<T>({
  formKey: key,
  label,
  style,
  enabled = true,
  ...viewProps
}: PropsWithChildren<Props<T>>) {
  const formikProps = useFormikContext<T>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of BooleanField. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, setFieldValue } = formikProps;

    const checked = values[key];
    return (
      <View style={[styles.container, style]} {...viewProps}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={
              enabled ? () => setFieldValue(key, !values[key]) : undefined
            }
          >
            <View style={styles.checkbox}>
              {checked && (
                <Image
                  source={require("../../assets/icons/cross.png")}
                  style={styles.cross}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <ErrorMessage name={key} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  checkboxContainer: {
    flexGrow: 0,
    marginRight: 17.5,
  },
  labelContainer: {
    flexDirection: "column",
    flexGrow: 1,
  },
  label: {
    color: "#a3a5a8",
    fontFamily: "HelveticaNeueLTPro-Bd",
    fontSize: 16,
  },
  checkbox: {
    backgroundColor: "#e7e7e8",
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cross: {
    width: "75%",
    height: "75%",
  },
});
