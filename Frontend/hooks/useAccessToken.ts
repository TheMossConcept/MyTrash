import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function useAccessToken() {
  const [accessToken, setAccessToken] = useState<string | undefined>();

  AsyncStorage.getItem("accessToken").then((localAccessToken) => {
    setAccessToken(localAccessToken || undefined);
  });

  return accessToken;
}
