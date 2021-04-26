import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import ClusterList from "../components/shared/ClusterList";

import { Text, View } from "../components/Themed";
import useClusters from "../hooks/useCluster";
import { TabsParamList } from "../typings/types";

type Props = StackScreenProps<TabsParamList, "Logistik">;

const LogisticsScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const clusters = useClusters({ logisticsPartnerId: userId });
  /* Vis afhentningsanmodninger */
  return (
    <View style={styles.container}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => <Text style={styles.title}>{cluster.id}</Text>}
      </ClusterList>
    </View>
  );
};

export default LogisticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
