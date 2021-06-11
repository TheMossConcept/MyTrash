import React, { FC } from "react";
import { isEmpty } from "lodash";
import { Button, StyleSheet, Text, View } from "react-native";
import useCollectors, { Collector } from "../../hooks/useCollectors";

type Props = { clusterId: string };

const CollectorList: FC<Props> = ({ clusterId }) => {
  const { collectors, refetchCollectors } = useCollectors({ clusterId });

  return (
    <View>
      {isEmpty(collectors) ? (
        <Text>Ingen indsamlere tilføjet</Text>
      ) : (
        collectors.map((collector) => (
          <CollectorView
            collector={collector}
            key={collector.id}
            deletionCallback={refetchCollectors}
          />
        ))
      )}
    </View>
  );
};

type CollectorViewProps = {
  collector: Collector;
  deletionCallback?: () => void;
};

const CollectorView: FC<CollectorViewProps> = ({
  collector,
  deletionCallback,
}) => {
  const deleteUser = () => {
    // TODO: Call delete endpoint with collector.id
    if (deletionCallback) {
      deletionCallback();
    }
  };

  return (
    <View style={styles.collectorContainer}>
      <Text>{collector.displayName}</Text>
      <Button title="Slet bruger" onPress={deleteUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  collectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default CollectorList;
