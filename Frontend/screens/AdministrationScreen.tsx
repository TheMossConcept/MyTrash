import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { StyleSheet, Text } from "react-native";
import ClusterCreationForm from "../components/ClusterCreationForm";

import { View } from "../components/Themed";
import UserInvitationForm from "../components/UserInvitationForm";
import { TabsParamList } from "../typings/types";
import ClusterList from "../components/shared/ClusterList";
import useClusters from "../hooks/useCluster";

type Props = StackScreenProps<TabsParamList, "Administration">;

const AdministrationScreen: FC<Props> = () => {
  const clusters = useClusters();

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
