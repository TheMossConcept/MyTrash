import { Formik, FormikConfig } from "formik";
import React, { PropsWithChildren } from "react";
import Container, { ContainerProps } from "./Container";

type Props<T> = FormikConfig<T> & Pick<ContainerProps, "style">;

export default function FormContainer<T>({
  children,
  style,
  ...formikConfig
}: PropsWithChildren<Props<T>>) {
  // TODO: Add global view context here!
  return (
    <Formik {...formikConfig}>
      {() => {
        return <Container style={style}>{children}</Container>;
      }}
    </Formik>
  );
}
