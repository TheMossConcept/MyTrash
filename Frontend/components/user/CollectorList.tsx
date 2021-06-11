import React, { FC } from "react";
import { isEmpty } from "lodash";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import useCollectors, { Collector } from "../../hooks/useCollectors";
import useAxiosConfig from "../../hooks/useAxiosConfig";

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
            clusterId={clusterId}
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
  clusterId: string;
  deletionCallback?: () => void;
};

const CollectorView: FC<CollectorViewProps> = ({
  collector,
  clusterId,
  deletionCallback,
}) => {
  const sharedAxiosConfig = useAxiosConfig();

  const deleteUser = () => {
    axios
      .delete("/DeleteCollector", {
        params: { clusterId, collectorId: collector.id },
        ...sharedAxiosConfig,
      })
      .then(() => {
        // TODO: Provide feedback here as well!
        if (deletionCallback) {
          deletionCallback();
        }
      });
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
