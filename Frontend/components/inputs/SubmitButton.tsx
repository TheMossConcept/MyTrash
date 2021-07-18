import { useFormikContext } from "formik";
import React, { FC } from "react";
import MobileButton, { MobileButtonProps } from "../styled/MobileButton";

// TODO: Change this so title just comes from StyledButtonProps as well
type Props = { title: string } & Omit<MobileButtonProps, "text">;

const SubmitButton: FC<Props> = ({ title, ...mobileButtonProps }) => {
  const formikProps = useFormikContext<any>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of SubmitButton. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { handleSubmit, isValid, isSubmitting } = formikProps;
    return (
      <MobileButton
        text={title}
        disabled={!isValid || isSubmitting}
        onPress={() => handleSubmit()}
        isVerticalButton
        {...mobileButtonProps}
      />
    );
  }
};

export default SubmitButton;
