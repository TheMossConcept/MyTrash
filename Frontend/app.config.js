// NB: Here would be an obvious place to allow ad-hoc overwrite via envrionment variables
// (e.g. for throw-away developments)
const localConfig = {
  AUTHORIZATION_URL:
    "https://houeb2c.b2clogin.com/houeb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration",
  AZURE_AD_CLIENT_ID: "5a5e1ff1-c935-4cc6-b6b6-5ab356682d10",
  BACKEND_URL: "http://localhost:7071/api",
  ENVIRONMENT_NAME: "local",
};
const stagingConfig = {
  AUTHORIZATION_URL:
    "https://houeb2c.b2clogin.com/houeb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration",
  AZURE_AD_CLIENT_ID: "5a5e1ff1-c935-4cc6-b6b6-5ab356682d10",
  BACKEND_URL: "https://mytrash-test.azurewebsites.net/api",
  ENVIRONMENT_NAME: "staging",
};
const productionConfig = {
  AUTHORIZATION_URL:
    "https://houeb2c.b2clogin.com/houeb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration",
  AZURE_AD_CLIENT_ID: "5a5e1ff1-c935-4cc6-b6b6-5ab356682d10",
  BACKEND_URL: "https://func-houe-mytrash.azurewebsites.net/api",
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
  name: "MyTrash",
  owner: "houe",
  slug: "my-trash",
  version: "1.0.7",
  orientation: "portrait",
  scheme: "mytrash",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  icon: "./assets/icons/app_icon.png",
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.houe.mytrash",
  },
  android: {
    package: "com.houe.mytrash",
    versionCode: 2,
    adaptiveIcon: {
      backgroundColor: "#FFFFFF",
    },
  },
  description: "",
  extra: configToUse,
};
