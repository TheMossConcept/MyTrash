import { useFormikContext } from "formik";
import React, { FC } from "react";
import MobileButton, { MobileButtonProps } from "../styled/MobileButton";
import WebButton from "../styled/WebButton";

// TODO: Change this so title just comes from StyledButtonProps as well
type Props = { title: string; isWeb?: boolean } & Omit<
  MobileButtonProps,
  "text"
>;

const SubmitButton: FC<Props> = ({
  title,
  isWeb = false,
  ...mobileButtonProps
}) => {
  const formikProps = useFormikContext<any>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of SubmitButton. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { handleSubmit, isValid, isSubmitting } = formikProps;
    return isWeb ? (
      <WebButton
        text={title}
        disabled={!isValid || isSubmitting}
        onPress={() => handleSubmit()}
        // It almost the same props that occur in the WebButton as in the MobileButton
        {...mobileButtonProps}
      />
    ) : (
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
