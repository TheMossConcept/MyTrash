import React, { FC, useReducer } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Snackbar } from "react-native-paper";

type Props = {
  onDismiss?: () => void;
};

type DismissableSnackbarState = {
  shown: boolean;
  title: string;
};

type DismissableSnackbarActions =
  | { type: "toggle" }
  | {
      type: "updateTitle";
      payload: string;
    };

function reducer(
  state: DismissableSnackbarState,
  action: DismissableSnackbarActions
) {
  switch (action.type) {
    case "toggle":
      return { ...state, shown: !state.shown };
    case "updateTitle":
      return { ...state, title: action.payload };
    default:
      console.warn("In default case in DismissableSnackbar");
      return state;
  }
}

const initialState: DismissableSnackbarState = { shown: false, title: "" };

// TODO: Change this such that it is absolutely positioned and always shown at the bottom
const DismissableSnackbar: FC<Props> = ({ onDismiss }) => {
  // TODO: Move this out into the topmost component and access it through context
  const [state, dispatch] = useReducer(reducer, initialState);

  const { height } = useWindowDimensions();

  const dismiss = () => {
    dispatch({ type: "toggle" });
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <View style={styles.snackbarContainer}>
      <Snackbar
        // Empirically, it has been determined that 80 works well.
        style={{ ...styles.snackbar, top: height - 80 }}
        visible={state.shown}
        onDismiss={dismiss}
        action={{
          label: "OK",
          onPress: dismiss,
        }}
      >
        {state.title}
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
    zIndex: 1,
    width: "100%",
  },
});

export default DismissableSnackbar;
