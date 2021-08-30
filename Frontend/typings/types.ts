// Navigation
export type RootStackParamList = {
  Root: undefined;
  Join: { clusterId?: string };
  Invitation: { clusterId: string };
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
  NoAccess: { text?: string };
};

export type AppRole = {
  displayName: string;
  multilineDisplayName: string;
  id: string;
};

export type Product = {
  id: string;
  productNumber: number;
  hasBeenSent: boolean;
};
