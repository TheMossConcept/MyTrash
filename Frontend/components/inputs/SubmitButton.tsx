import { useFormikContext } from "formik";
import React, { FC } from "react";
import { Button } from "react-native";

type Props = { title: string };

const SubmitButton: FC<Props> = ({ title }) => {
  const formikProps = useFormikContext<any>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of SubmitButton. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { handleSubmit, isValid, isSubmitting } = formikProps;
    return (
      <Button
        title={title}
        disabled={!isValid || isSubmitting}
        onPress={() => handleSubmit()}
      />
    );
  }
};

export default SubmitButton;
