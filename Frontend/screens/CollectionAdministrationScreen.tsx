import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { Button } from "react-native";
import ClusterList from "../components/shared/ClusterList";

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
    <Container style={{ justifyContent: "flex-start" }}>
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
    </Container>
  );
};

export default CollectionAdministrationScreen;
