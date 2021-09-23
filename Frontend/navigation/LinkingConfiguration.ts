import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Login: "login",
      Root: {
        screens: {
          Administration: "administration",
          Collection: "indsamling",
          CollectionAdministration: "Indsamlingsadministration",
          Logistics: "Logistik",
          Recipient: "Modtagelse",
          Production: "Produktion",
        },
      },
      Join: "tilmeld",
      Invitation: "invitation",
      NotFound: "*",
    },
  },
};
