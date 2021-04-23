import React, { FC } from "react";
import { Snackbar } from "react-native-paper";

type Props = {
  title: string;
  showState: [boolean, (value: boolean) => void];
  onDismiss?: () => void;
};

const DismissableSnackbar: FC<Props> = ({ title, showState, onDismiss }) => {
  const [showSnackbar, setShowSnackbar] = showState;

  const dismiss = () => {
    setShowSnackbar(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Snackbar
      visible={showSnackbar}
      onDismiss={dismiss}
      action={{
        label: "OK",
        onPress: dismiss,
      }}
    >
      {title}
    </Snackbar>
  );
};

export default DismissableSnackbar;
