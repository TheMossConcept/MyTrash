import React, { FC, ReactElement, useState } from "react";
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { List } from "react-native-paper";
import Container from "../shared/Container";

export type Cluster = {
  displayName: string;
  id: string;
};

type Props = {
  clusters: Cluster[];
  showSingleClusterExpanded?: boolean;
  // TODO: Put a proper type on the cluster! It needs to contain all cluster properties
  // and should probably be generic
  children: ({ cluster }: { cluster: any }) => ReactElement;
};

const ClusterList: FC<Props> = ({
  clusters,
  showSingleClusterExpanded = true,
  children,
}) => {
  const numberOfClusters = clusters.length;
  if (numberOfClusters === 0) {
    return (
      <Text style={{ textAlign: "center" }}>Ingen clustere tilgængelige</Text>
    );
  }

  return numberOfClusters === 1 && showSingleClusterExpanded ? (
    <Container>{children({ cluster: clusters[0] })}</Container>
  ) : (
    <List.Section title="Clusters" style={styles.container}>
      {clusters.map((cluster) => (
        <ListItem key={cluster.id} cluster={cluster}>
          {children}
        </ListItem>
      ))}
    </List.Section>
  );
};

type ListItemProps = {
  cluster: Cluster;
} & Pick<Props, "children">;

const ListItem: FC<ListItemProps> = ({ cluster, children }) => {
  const [clusterDetailsAreShown, setClusterDetailsAreShown] = useState(false);
  const toggleClusterDetailsAreShown = () => {
    setClusterDetailsAreShown(!clusterDetailsAreShown);
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemSelector}>
        <TouchableWithoutFeedback onPress={toggleClusterDetailsAreShown}>
          <Text style={styles.itemText}>{cluster.displayName}</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.itemDetails}>
        {clusterDetailsAreShown && (
          <View style={styles.border}>{children({ cluster })}</View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    width: "95%",
  },
  itemContainer: {
    flexDirection: "row",
    width: "95%",
  },
  itemSelector: {
    flex: 1,
  },
  itemText: {
    borderColor: "lightgrey",
    borderRadius: 8,
    borderWidth: 0.1,
    borderStyle: "solid",
    textAlign: "center",
    backgroundColor: "white",
    fontSize: 17,
    fontWeight: "500",
    padding: 10,
    marginBottom: 15,
    // cursor: "pointer",
  },
  border: {
    borderColor: "lightgrey",
    borderRadius: 8,
    borderWidth: 2,
    padding: 20,
    borderStyle: "solid",
  },
  itemDetails: {
    flex: 3,
    marginLeft: 10,
  },
});

export default ClusterList;
