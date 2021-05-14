import { AxiosRequestConfig } from "axios";
import { BACKEND_URL } from "react-native-dotenv";

const getSharedAxiosConfig = (accessToken?: string): AxiosRequestConfig => {
  // TODO: Make this a hook and call useAccessToken instead of requiring the accessToken as a parameteaccessToken as a parameter
  return {
    baseURL: BACKEND_URL,
    headers: {
      "access-token": accessToken,
    },
  };
};

export default { getSharedAxiosConfig };
