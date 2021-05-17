import React, { FC, ReactElement, useState } from "react";
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
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
