import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import Constants from "expo-constants";

const getDefaultRedirectUri = () => {
  // This is not the nicest way of doing it, but it gets the job done reliably (and also using
  // a mechanism actually meant to provide information about the relevant platform
  const platformName = Object.keys(Constants.platform || {})[0];
  const defaultRedirectUrl =
    // NB! Be aware that we cannot use makeRedirectUrl as it changes with the ip address of the device
    // which is not useable when we need a fixed list of approved redirect URIs for azure AD
    platformName === "web" ? makeRedirectUri() : Linking.createURL("/");

  return defaultRedirectUrl;
};

export default getDefaultRedirectUri;
