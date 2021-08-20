import { Formik, FormikConfig } from "formik";
import React, { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

type Props<T> = FormikConfig<T> & Pick<ViewProps, "style">;

export default function FormContainer<T>({
  children,
  style,
  ...formikConfig
}: PropsWithChildren<Props<T>>) {
  // TODO: Add global view context here!
  return (
    <Formik {...formikConfig}>
      {() => <View style={style}>{children}</View>}
    </Formik>
  );
}
