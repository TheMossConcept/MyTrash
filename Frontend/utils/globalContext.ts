import React from "react";

const GlobalSnackbarContext = React.createContext<(title: string) => void>(() =>
  console.log("No show snackbar function passed along")
);

export default GlobalSnackbarContext;
