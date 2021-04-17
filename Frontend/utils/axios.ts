import { AxiosRequestConfig } from "axios";

const getSharedAxiosConfig = (accessToken: string): AxiosRequestConfig => {
  return {
    // TODO: Fix hardcoding!!
    baseURL: "https://houe-plastic-recycling-windows.azurewebsites.net/api",
    headers: {
      "access-token": accessToken,
    },
  };
};

export default { getSharedAxiosConfig };
