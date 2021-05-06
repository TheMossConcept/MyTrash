import React, { FC, ReactElement } from "react";
import { StyleSheet } from "react-native";
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
  return (
    <List.Section title="Clusters" style={styles.section}>
      {clusters.map((cluster) => (
        <List.Accordion key={cluster.id} title={cluster.displayName}>
          {children({ cluster })}
        </List.Accordion>
      ))}
    </List.Section>
  );
};

const styles = StyleSheet.create({
  section: {
    alignItems: "flex-start",
    width: "95%",
  },
});

export default ClusterList;
