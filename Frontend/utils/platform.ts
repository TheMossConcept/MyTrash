import Constants from "expo-constants";

const platformName = Object.keys(Constants.platform || {})[0];
// This is not the nicest way of doing it, but it gets the job done reliably (and also using
// a mechanism actually meant to provide information about the relevant platform

export default { platformName };
