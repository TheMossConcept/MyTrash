import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Login: "login",
      Root: {
        screens: {
          Administration: "administration",
          Collection: "indsamling",
          CollectionAdministration: "indsamlingsadministration",
          Logistics: "logistik",
          Recipient: "modtagelse",
          Production: "produktion",
        },
      },
      Join: "tilmeld",
      Invitation: "invitation",
      NotFound: "*",
    },
  },
};
