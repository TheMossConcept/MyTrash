import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

type Props = {
  title: string;
  showState: [boolean, (value: boolean) => void];
  onDismiss?: () => void;
};

// TODO: Change this such that it is absolutely positioned and always shown at the bottom
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
      style={styles.snackbar}
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

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    width: "100%",
  },
});

export default DismissableSnackbar;
