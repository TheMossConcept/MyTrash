// Navigation
export type RootStackParamList = {
  Root: undefined;
  Join: { clusterId?: string };
  Login: undefined;
  NotFound: undefined;
};

export type TabsParamList = {
  Administration: undefined;
  Collection: { userId: string };
  CollectionAdministration: { userId: string };
  Logistics: { userId: string };
  Recipient: { userId: string };
  Production: { userId: string };
  NoAccess: undefined;
};
