// Navigation
export type RootStackParamList = {
  Root: undefined;
  Join: { clusterId?: string };
  Login: undefined;
  NotFound: undefined;
};

export type TabsParamList = {
  Administration: undefined;
  Indsamling: { userId: string };
  Indsamlingsadministration: { userId: string };
  Logistik: { userId: string };
  Modtagelse: { userId: string };
  Produktion: { userId: string };
  NoAccess: undefined;
};
