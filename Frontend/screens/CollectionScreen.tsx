import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import axiosUtils from "../utils/axios";
import CollectionForm, {
  CollectionFormData,
} from "../components/forms/OrderCollectionForm";
import ClusterList from "../components/shared/ClusterList";
import useAccessToken from "../hooks/useAccessToken";
import useClusters from "../hooks/useCluster";
import { TabsParamList } from "../typings/types";
import DismissableSnackbar from "../components/shared/DismissableSnackbar";

type Props = StackScreenProps<TabsParamList, "Indsamling">;

const CollectionScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [
    collectionFormData,
    setCollectionFormData,
  ] = useState<CollectionFormData>({});
  const clusters = useClusters({ collectorId: userId });
  return (
    <View style={styles.container}>
      <ClusterList clusters={clusters}>
        {({ cluster }) => (
          <View>
            <CollectionForm
              collectionFormState={[collectionFormData, setCollectionFormData]}
            />
            <OrderCollectionButton
              clusterId={cluster.id}
              userId={userId}
              collectionFormData={collectionFormData}
            />
          </View>
        )}
      </ClusterList>
    </View>
  );
};

export default CollectionScreen;

type OrderCollectionButtonProps = {
  clusterId: string;
  userId: string;
  collectionFormData: CollectionFormData;
};

const OrderCollectionButton: FC<OrderCollectionButtonProps> = ({
  clusterId,
  userId,
  collectionFormData,
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const accessToken = useAccessToken();
  const createCollectionRequest = () => {
    axios.post(
      "CreatePlasticCollection/",
      { clusterId, requesterId: userId, ...collectionFormData },
      { ...axiosUtils.getSharedAxiosConfig(accessToken) }
    );
  };
  return (
    <View>
      <Button title="Bestil afhentning" onPress={createCollectionRequest} />
      <DismissableSnackbar
        title="Afhentning bestilt"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
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
