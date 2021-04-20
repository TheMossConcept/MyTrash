import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

let globalAccessToken: string | undefined;

export default function useAccessToken() {
  useEffect(() => {
    // Only set the access token if it is not already set, otherwise, we'll just re-render forever
    if (globalAccessToken === undefined) {
      AsyncStorage.getItem("accessToken").then((accessToken) => {
        globalAccessToken = accessToken || undefined;
      });
    }
  }, []);

  return globalAccessToken;
}
