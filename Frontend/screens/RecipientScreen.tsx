import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useState, useEffect } from "react";
import { Button, StyleSheet, Text } from "react-native";
import sortCollectionsByStatus from "../utils/plasticCollections";
import axiosUtils from "../utils/axios";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collections/PlasticCollectionsDetails";

import { View } from "../components/Themed";
import useAccessToken from "../hooks/useAccessToken";
import { TabsParamList } from "../typings/types";
import DismissableSnackbar from "../components/shared/DismissableSnackbar";
import CreateBatch from "../components/batch/CreateBatch";
import BatchDetails, { Batch } from "../components/batch/BatchDetails";
import sortBatchByStatus from "../utils/batch";
import FormContainer from "../components/shared/FormContainer";
import NumberField from "../components/inputs/NumberField";
import SubmitButton from "../components/inputs/SubmitButton";

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
        {(batch) => <RegisterBatchSent batchId={batch.id} />}
      </BatchDetails>
      <BatchDetails batches={sortedBatches.sent} title="Afsendte" />
      <BatchDetails batches={sortedBatches.received} title="Modtaget" />
    </View>
  );
};

type RegisterBatchSentProps = {
  batchId: string;
};

const RegisterBatchSent: FC<RegisterBatchSentProps> = ({ batchId }) => {
  const accessToken = useAccessToken();

  const markBatchAsSent = () => {
    axios.post(
      "/RegisterBatchSent",
      {},
      { ...axiosUtils.getSharedAxiosConfig(accessToken), params: { batchId } }
    );
  };
  return <Button title="Marker som afsendt" onPress={markBatchAsSent} />;
};

type RegisterPlasticCollectionRecieptProps = {
  plasticCollection: PlasticCollection;
};

type RegisterWeightFormData = {
  weight?: number;
};

const RegisterPlasticCollectionReciept: FC<RegisterPlasticCollectionRecieptProps> = ({
  plasticCollection,
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const accessToken = useAccessToken();
  const registerReciept = (
    values: RegisterWeightFormData,
    resetForm: () => void
  ) => {
    axios
      .post(
        "/RegisterPlasticCollectionReceived",
        { ...values },
        {
          params: { collectionId: plasticCollection.id },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        }
      )
      .then(() => {
        setShowSuccessSnackbar(true);
        resetForm();
      });
  };

  const initialValues: RegisterWeightFormData = {
    weight: plasticCollection.weight,
  };

  return (
    <FormContainer
      initialValues={initialValues}
      onSubmit={(values, formikHelpers) =>
        registerReciept(values, formikHelpers.resetForm)
      }
    >
      <NumberField formKey="weight" label="Vægt" />
      <SubmitButton title="Register modtagelse" />
      <DismissableSnackbar
        title="Modtagelse registreret"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </FormContainer>
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
