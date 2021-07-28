import * as Linking from "expo-linking";

const getDefaultRedirectUri = () => {
  return Linking.createURL("/");
};

export default getDefaultRedirectUri;
