import { Formik, FormikHelpers } from "formik";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export type FormContextValues<T> = {
  values: T;
  handleChange: (key: keyof T) => void;
  handleBlur: (key: keyof T) => void;
};

export const FormContext = React.createContext<FormContextValues<any> | null>(
  null
);

type Props<T> = {
  initialValues: T;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
};

export default function FormContainer<T>({
  initialValues,
  onSubmit,
  children,
}: PropsWithChildren<Props<T>>) {
  // TODO: Add global view context here!
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(formikProps: FormContextValues<T>) => {
        return (
          <FormContext.Provider value={formikProps}>
            <View style={styles.container}>{children}</View>
          </FormContext.Provider>
        );
      }}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
});
