import React, { FC, ReactElement } from "react";
import { List } from "react-native-paper";

export type Cluster = {
  displayName: string;
  id: string;
};

type Props = {
  clusters: Cluster[];
  children: ({ cluster }: { cluster: Cluster }) => ReactElement;
};

const ClusterList: FC<Props> = ({ clusters, children }) => {
  console.log(clusters);
  return (
    <List.Section title="Clusters">
      {clusters.map((cluster) => (
        <List.Accordion key={cluster.id} title={cluster.displayName}>
          {children({ cluster })}
        </List.Accordion>
      ))}
    </List.Section>
  );
};

export default ClusterList;
