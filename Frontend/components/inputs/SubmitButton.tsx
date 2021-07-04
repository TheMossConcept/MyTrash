import { useFormikContext } from "formik";
import React, { FC } from "react";
import Button, { StyledButtonProps } from "../styled/Button";

// TODO: Change this so title just comes from StyledButtonProps as well
type Props = { title: string } & Omit<StyledButtonProps, "text">;

const SubmitButton: FC<Props> = ({ title, ...styledButtonProps }) => {
  const formikProps = useFormikContext<any>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of SubmitButton. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { handleSubmit, isValid, isSubmitting } = formikProps;
    return (
      <Button
        text={title}
        disabled={!isValid || isSubmitting}
        onPress={() => handleSubmit()}
        isVerticalButton
        {...styledButtonProps}
      />
    );
  }
};

export default SubmitButton;
