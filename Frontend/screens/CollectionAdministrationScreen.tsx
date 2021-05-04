import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { Button, StyleSheet } from "react-native";
import ClusterList from "../components/shared/ClusterList";

import { View } from "../components/Themed";
import UserForm, { UserFormData } from "../components/forms/UserForm";
import { TabsParamList } from "../typings/types";
import useClusters from "../hooks/useCluster";
import Container from "../components/shared/Container";
import { UpdateCluster } from "../components/forms/ModifyCluster";

type Props = StackScreenProps<TabsParamList, "Indsamlingsadministration">;

const CollectionAdministrationScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const { clusters, refetchClusters } = useClusters({
    collectionAdministratorId: userId,
  });

  const userFormDataState = React.useState<UserFormData>({});
  return (
    <View style={styles.container}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <Container>
            <UpdateCluster
              clusterId={cluster.id}
              successCallback={refetchClusters}
            />
            <UserForm userFormState={userFormDataState} isPartner={false} />
            <Button
              title="Inviter"
              onPress={() => console.log("Not implemented yet!")}
            />
          </Container>
        )}
      </ClusterList>
    </View>
  );
};

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

export default CollectionAdministrationScreen;
