import React, { FC } from "react";
import { List } from "react-native-paper";

export type Cluster = {
  displayName: string;
  id: string;
};

type Props = { clusters: Cluster[] };

const ClusterList: FC<Props> = ({ clusters, children }) => {
  return (
    <List.Section title="Clusters">
      {clusters.map((cluster) => (
        <List.Accordion key={cluster.id} title={cluster.displayName}>
          {children}
        </List.Accordion>
      ))}
      ;
    </List.Section>
  );
};

export default ClusterList;
