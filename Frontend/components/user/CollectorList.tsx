import React, { FC, useContext } from "react";
import { isEmpty } from "lodash";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import useCollectors, { Collector } from "../../hooks/useCollectors";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";

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
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const sharedAxiosConfig = useAxiosConfig();

  const deleteUser = () => {
    axios
      .delete("/DeleteCollector", {
        params: { clusterId, collectorId: collector.id },
        ...sharedAxiosConfig,
      })
      .then(() => {
        showGlobalSnackbar(`Indsamleren ${collector.displayName} er slettet`);

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
