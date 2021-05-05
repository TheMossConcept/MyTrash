import { Formik, FormikConfig } from "formik";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

type Props<T> = FormikConfig<T>;

export default function FormContainer<T>({
  initialValues,
  onSubmit,
  children,
}: PropsWithChildren<Props<T>>) {
  // TODO: Add global view context here!
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {() => {
        return <View style={styles.container}>{children}</View>;
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
