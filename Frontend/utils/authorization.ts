import * as Linking from "expo-linking";

const getDefaultRedirectUri = () => {
  return Linking.createURL("login");
};

export default getDefaultRedirectUri;
