import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState, useEffect } from "react";
import { Button, StyleSheet, Text } from "react-native";
import sortCollectionsByStatus from "../utils/plasticCollections";
import axiosUtils from "../utils/axios";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collections/PlasticCollectionsDetails";
import NumericInput from "../components/inputs/NumericInput";

import { View } from "../components/Themed";
import useAccessToken from "../hooks/useAccessToken";
import { TabsParamList } from "../typings/types";
import DismissableSnackbar from "../components/shared/DismissableSnackbar";
import CreateBatch from "../components/batch/CreateBatch";
import BatchDetails, { Batch } from "../components/batch/BatchDetails";
import sortBatchByStatus from "../utils/batch";

type Props = StackScreenProps<TabsParamList, "Modtagelse">;

const RecipientScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const accessToken = useAccessToken();
  useEffect(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { recipientPartnerId: userId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [accessToken, userId]);

  useEffect(() => {
    axios
      .get("/GetBatches", {
        params: { recipientPartnerId: userId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setBatches(data);
      });
  }, [accessToken, userId]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);
  const sortedBatches = sortBatchByStatus(batches);

  const markBatchAsSent = () => console.log("Not implemented yet!");

  return (
    <View style={styles.container}>
      <PlasticCollectionsDetails
        title="Modtaget"
        plasticCollections={sortedCollections.delivered}
      >
        {(collection) => (
          <RegisterPlasticCollectionReciept plasticCollection={collection} />
        )}
      </PlasticCollectionsDetails>
      <PlasticCollectionsDetails
        title="Bekræftet"
        plasticCollections={sortedCollections.received}
      >
        {(collection) => {
          // TODO: Change this such that it is a high level operation and you can select a cluster
          return (
            <CreateBatch
              clusterId={collection.clusterId}
              batchCreatorId={userId}
            />
          );
        }}
      </PlasticCollectionsDetails>
      <Text>Batches</Text>
      <BatchDetails batches={sortedBatches.created} title="Oprettede">
        {() => <Button title="Marker som afsendt" onPress={markBatchAsSent} />}
      </BatchDetails>
      <BatchDetails batches={sortedBatches.sent} title="Afsendte" />
      <BatchDetails batches={sortedBatches.received} title="Modtagede" />
    </View>
  );
};

type RegisterPlasticCollectionRecieptProps = {
  plasticCollection: PlasticCollection;
};

const RegisterPlasticCollectionReciept: FC<RegisterPlasticCollectionRecieptProps> = ({
  plasticCollection,
}) => {
  const [weight, setWeight] = useState<number | undefined>(
    plasticCollection.weight
  );
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const accessToken = useAccessToken();
  const registerReciept = () => {
    axios
      .post(
        "/RegisterPlasticCollectionReceived",
        { weight },
        {
          params: { collectionId: plasticCollection.id },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        }
      )
      .then(() => setShowSuccessSnackbar(true));
  };

  return (
    <View>
      <NumericInput label="Vægt" numberState={[weight, setWeight]} />
      <Button title="Register modtagelse" onPress={registerReciept} />
      <DismissableSnackbar
        title="Modtagelse registreret"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  );
};

export default RecipientScreen;

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
