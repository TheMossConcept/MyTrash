// NB: Here would be an obvious place to allow ad-hoc overwrite via envrionment variables
// (e.g. for throw-away developments)
const localConfig = {
  AUTHORIZATION_URL:
    "https://mossconsultingorg.b2clogin.com/mossconsultingorg.onmicrosoft.com/v2.0/.well-known/openid-configuration",
  AZURE_AD_CLIENT_ID: "93d698bf-5f62-4b7d-9a5b-cf9fa4dd0412",
  BACKEND_URL: "http://localhost:7071/api",
  MOBILE_REDIRECT_URL: "expo://login",
  ENVIRONMENT_NAME: "local",
};
const stagingConfig = {
  AUTHORIZATION_URL:
    "https://mossconsultingorg.b2clogin.com/mossconsultingorg.onmicrosoft.com/v2.0/.well-known/openid-configuration",
  AZURE_AD_CLIENT_ID: "93d698bf-5f62-4b7d-9a5b-cf9fa4dd0412",
  BACKEND_URL: "https://houe-plastic-recycling-windows.azurewebsites.net/api",
  MOBILE_REDIRECT_URL: "expo://login",
  ENVIRONMENT_NAME: "development",
};
const productionConfig = {
  AUTHORIZATION_URL:
    "https://mossconsultingorg.b2clogin.com/mossconsultingorg.onmicrosoft.com/v2.0/.well-known/openid-configuration",
  AZURE_AD_CLIENT_ID: "93d698bf-5f62-4b7d-9a5b-cf9fa4dd0412",
  BACKEND_URL: "https://houe-plastic-recycling-windows.azurewebsites.net/api",
  MOBILE_REDIRECT_URL: "mytrash://login",
  ENVIRONMENT_NAME: "production",
};

// Default to productionConfig to avoid getting in trouble in production
let configToUse = productionConfig;

if (process.env.APPLICATION_ENVIRONMENT === "local") {
  configToUse = localConfig;
}
if (process.env.APPLICATION_ENVIRONMENT === "staging") {
  configToUse = stagingConfig;
}
if (process.env.APPLICATION_ENVIRONMENT === "production") {
  configToUse = productionConfig;
}

export default {
  name: "Houe plastic recycling",
  owner: "houe",
  slug: "houe-plastic-recycling",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "houe-plastic-recycling",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#FFFFFF",
    },
  },
  description: "",
  extra: configToUse,
};
