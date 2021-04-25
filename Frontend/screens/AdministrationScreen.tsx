import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { black } from "react-native-paper/lib/typescript/styles/colors";
import ClusterCreationForm from "../components/ClusterCreationForm";

import { View } from "../components/Themed";
import UserInvitationForm from "../components/UserInvitationForm";
import { AccessTokenContext } from "../navigation/TabNavigator";
import axiosUtils from "../utils/axios";
import { TabsParamList } from "../typings/types";
import ClusterList, { Cluster } from "../components/shared/ClusterList";

type Props = StackScreenProps<TabsParamList, "Administration">;

// TODO_SESSION: Iterate through all (active) clusters and show everything
// except ClusterCreationForm in the context of a cluster
// { route }
const AdministrationScreen: FC<Props> = () => {
  // const { userId } = route.params;
  const accessToken = useContext(AccessTokenContext);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get("GetClusters", {
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((clustersResult) => {
          setClusters(clustersResult.data);
        });
    }
  }, [accessToken]);

  return (
    <View style={styles.container}>
      <ClusterCreationForm />
      <ClusterList clusters={clusters}>
        <View style={styles.container}>
          <Text>Opret cluster</Text>
          <Text>Inviter bruger</Text>
          <UserInvitationForm />
        </View>
      </ClusterList>
    </View>
  );
};

export default AdministrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
  },
  autocompleteInput: {
    height: "200px",
  },
});
