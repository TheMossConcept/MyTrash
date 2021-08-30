import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosRequestConfig } from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import Constants from "expo-constants";
import GlobalSnackbarContext from "../utils/globalContext";

export default function useAxiosConfig(): AxiosRequestConfig {
  const { BACKEND_URL } = Constants.manifest.extra || {};
  const [accessToken, setAccessToken] = useState<string | undefined>();

  const showSnackbar = useContext(GlobalSnackbarContext);
  useEffect(() => {
    const errorHandlingInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (errorObject) => {
        const responseData = errorObject?.response?.data;
        if (responseData) {
          const { errorMessage } = responseData;
          if (errorMessage) {
            showSnackbar(errorMessage, true);
          }
        }

        return Promise.reject(errorObject);
      }
    );

    return () => axios.interceptors.response.eject(errorHandlingInterceptor);
  }, [showSnackbar]);

  useEffect(() => {
    AsyncStorage.getItem("accessToken").then((accessTokenFromLocalStorage) => {
      setAccessToken(accessTokenFromLocalStorage || undefined);
    });
  }, []);

  // Ensure that we don't get a new object instance every time we run this hook which would cause crazy re-rendering
  const sharedAxiosConfig = useMemo(
    () => ({
      baseURL: BACKEND_URL,
      headers: {
        "access-token": accessToken,
      },
    }),
    [accessToken, BACKEND_URL]
  );

  return sharedAxiosConfig;
}
