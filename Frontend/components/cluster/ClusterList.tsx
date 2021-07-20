import React, { FC, ReactElement, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { isEmpty } from "lodash";
import HeadlineText from "../styled/HeadlineText";
import WebButton from "../styled/WebButton";
import EmptyView from "../styled/EmptyView";

export type Cluster = {
  displayName: string;
  id: string;
};

type Props = {
  clusters: Cluster[];
  // TODO: Put a proper type on the cluster! It needs to contain all cluster properties
  // and should probably be generic
  children: ({ cluster }: { cluster: any }) => ReactElement;
};

// TODO: The layout for this one, batchDetails and plasticCollectionDetails
// are VERY similar. Reuse that in a common component at some point! Also, use
// themeing more extensively
const ClusterList: FC<Props> = ({ clusters, children }) => {
  const numberOfClusters = clusters.length;
  if (numberOfClusters === 0) {
    return <HeadlineText text="Ingen clustre tilgængelige" />;
  }

  return (
    <View>
      {isEmpty(clusters) ? (
        <EmptyView />
      ) : (
        clusters.map((cluster) => (
          <ListItem
            key={cluster.id}
            cluster={cluster}
            style={styles.clusterItem}
          >
            {children}
          </ListItem>
        ))
      )}
    </View>
  );
};

type ListItemProps = {
  cluster: Cluster;
} & Pick<Props, "children"> &
  ViewProps;

const ListItem: FC<ListItemProps> = ({
  cluster,
  children,
  style,
  ...viewProps
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <View style={[styles.container, style]} {...viewProps}>
      <View style={{ flex: 1 }}>
        <WebButton
          icon={{
            src: require("../../assets/icons/dropdown_grey.png"),
            width: 29,
            height: 29,
          }}
          text={cluster.displayName}
          style={{ width: 256 }}
          onPress={toggleDetails}
          isSelected={showDetails}
        />
      </View>
      {showDetails && (
        <View style={styles.detailsContainer}>{children({ cluster })}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailsContainer: {
    flex: 2,
    marginLeft: 14,
  },
  clusterItem: {
    marginBottom: 23,
  },
});

export default ClusterList;
