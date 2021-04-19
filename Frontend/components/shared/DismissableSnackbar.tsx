import React from "react";
import { Snackbar } from "react-native-paper";

type Props = {
  title: string;
  showState: [boolean, (value: boolean) => void];
  onDismiss: () => void | undefined;
};

export default function DismissableSnackbar({
  title,
  onDismiss,
  showState,
}: Props) {
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
}
