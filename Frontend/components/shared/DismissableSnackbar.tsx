import React, { FC, useReducer } from "react";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

type AvailableStyles = "default" | "error";

type DismissableSnackbarState = {
  shown: boolean;
  title: string;
  style: AvailableStyles;
};

type DismissableSnackbarActions =
  | { type: "hide" }
  | { type: "show" }
  | { type: "updateStyle"; payload: AvailableStyles }
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
    case "updateStyle":
      return { ...state, style: action.payload };
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
  style: "default",
};

export const useSnackbarState = () => {
  return useReducer(reducer, initialState);
};

type Props = {
  globalSnackbarState: [
    DismissableSnackbarState,
    React.Dispatch<DismissableSnackbarActions>
  ];
  isWeb?: boolean;
};

const DismissableSnackbar: FC<Props> = ({
  globalSnackbarState,
  isWeb = false,
}) => {
  if (globalSnackbarState) {
    const [state, dispatch] = globalSnackbarState;

    const dismiss = () => {
      dispatch({ type: "hide" });
    };

    const bottomPositionStyle = isWeb
      ? { bottom: 20 - global.window.pageYOffset }
      : { bottom: 20 };

    // TODO: We should do this with a theme instead!!
    const snackbarStyle =
      state.style === "error"
        ? [styles.snackbar, bottomPositionStyle, styles.error]
        : [styles.snackbar, bottomPositionStyle];

    return (
      <Snackbar
        style={snackbarStyle}
        visible={state.shown}
        onDismiss={dismiss}
        action={{
          label: "LUK",
          onPress: dismiss,
        }}
      >
        {state.title}
      </Snackbar>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  error: {
    backgroundColor: "#fc2803",
  },
  snackbar: {
    alignSelf: "center",
    width: "95%",
    margin: "auto",
    bottom: 20,
    position: "absolute",
    zIndex: 1,
  },
});

export default DismissableSnackbar;
