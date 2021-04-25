// Navigation
export type RootStackParamList = {
  Root: { accessToken: string; idToken: string };
  Login: undefined;
  NotFound: undefined;
};

export type TabsParamList = {
  Administration: undefined;
  Indsamling: undefined;
  Indsamlingsadministration: { userId: string };
  Logistik: undefined;
  Modtagelse: undefined;
  Produktion: undefined;
};
