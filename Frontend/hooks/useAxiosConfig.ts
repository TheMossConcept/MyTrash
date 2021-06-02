import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosRequestConfig } from "axios";
import { useEffect, useMemo, useState } from "react";
import { BACKEND_URL } from "react-native-dotenv";

export default function useAxiosConfig(): AxiosRequestConfig {
  const [accessToken, setAccessToken] = useState<string | undefined>();

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
    [accessToken]
  );

  return sharedAxiosConfig;
}
