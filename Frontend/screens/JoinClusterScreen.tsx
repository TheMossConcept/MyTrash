import React, { FC } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import AutocompleteInput from "../components/inputs/AutocompleteInput";
import { RootStackParamList } from "../typings/types";
import CollectorForm from "../components/user/CollectorForm";
import MainContentArea from "../components/styled/MainContentArea";

type Props = StackScreenProps<RootStackParamList, "Join">;

// TODO_SESSION: Get the clusterId from deep linking. This happens in
// the case of a closed cluster
const JoinClusterForm: FC<Props> = ({ route }) => {
  const { clusterId } = route.params || {};

  return (
    <MainContentArea>
      <CollectorForm title="Tilmeld" clusterId={clusterId}>
        {clusterId === undefined && (
          <AutocompleteInput formKey="clusterId" endpoint="/GetOpenClusters" />
        )}
      </CollectorForm>
    </MainContentArea>
  );
};

export default JoinClusterForm;
