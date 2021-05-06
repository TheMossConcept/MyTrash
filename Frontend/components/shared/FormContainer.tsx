import { Formik, FormikConfig } from "formik";
import React, { PropsWithChildren } from "react";
import Container from "./Container";

type Props<T> = FormikConfig<T>;

export default function FormContainer<T>({
  children,
  ...formikConfig
}: PropsWithChildren<Props<T>>) {
  // TODO: Add global view context here!
  return (
    <Formik {...formikConfig}>
      {() => {
        return <Container>{children}</Container>;
      }}
    </Formik>
  );
}
