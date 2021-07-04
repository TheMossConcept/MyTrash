import React, { FC, useReducer } from "react";
import { StyleSheet, View } from "react-native";
import { Snackbar } from "react-native-paper";

type DismissableSnackbarState = {
  shown: boolean;
  title: string;
};

type DismissableSnackbarActions =
  | { type: "hide" }
  | { type: "show" }
  | {
      type: "updateTitle";
      payload: string;
    };

function reducer(
  state: DismissableSnackbarState,
  action: DismissableSnackbarActions
) {
  switch (action.type) {
    case "hide":
      return { ...state, shown: false };
    case "show":
      return { ...state, shown: true };
    case "updateTitle":
      return { ...state, title: action.payload };
    default:
      console.warn("In default case in DismissableSnackbar");
      return state;
  }
}

const initialState: DismissableSnackbarState = {
  shown: false,
  title: "",
};

export const useSnackbarState = () => {
  return useReducer(reducer, initialState);
};

type Props = {
  globalSnackbarState: [
    DismissableSnackbarState,
    React.Dispatch<DismissableSnackbarActions>
  ];
};

const DismissableSnackbar: FC<Props> = ({ globalSnackbarState }) => {
  if (globalSnackbarState) {
    const [state, dispatch] = globalSnackbarState;

    const dismiss = () => {
      dispatch({ type: "hide" });
    };

    return (
      <View style={styles.snackbarContainer}>
        <Snackbar
          // Empirically, it has been determined that 5 works well
          style={{ ...styles.snackbar }}
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
  }
  return null;
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: "relative",
    zIndex: 1,
    width: "95%",
    margin: "auto",
  },
  snackbar: {
    bottom: 20,
    position: "absolute",
    zIndex: 1,
    width: "100%",
  },
});

export default DismissableSnackbar;
