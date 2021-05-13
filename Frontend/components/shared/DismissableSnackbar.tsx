import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
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
    <View style={styles.snackbarContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: "relative",
    zIndex: 1,
    width: "95%",
    margin: "auto",
  },
  snackbar: {
    position: "absolute",
    top: 45,
    zIndex: 1,
    width: "100%",
  },
});

export default DismissableSnackbar;
