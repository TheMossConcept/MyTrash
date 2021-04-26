import { AxiosRequestConfig } from "axios";

const getSharedAxiosConfig = (accessToken?: string): AxiosRequestConfig => {
  // TODO: Make this a hook and call useAccessToken instead of requiring the accessToken as a parameteaccessToken as a parameter
  return {
    // TODO: Fix hardcoding!!
    // baseURL: "https://houe-plastic-recycling-windows.azurewebsites.net/api",
    baseURL: "http://localhost:7071/api",
    headers: {
      "access-token": accessToken,
    },
  };
};

export default { getSharedAxiosConfig };
