import React, { FC, useContext, useState } from "react";
import * as yup from "yup";
import { isEmpty } from "lodash";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import useCollectors, { Collector } from "../../hooks/useCollectors";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";

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

const collectionGoalSchema = yup
  .object()
  .shape({ collectionGoal: yup.number().required() });

const CollectorView: FC<CollectorViewProps> = ({
  collector,
  clusterId,
  deletionCallback,
}) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const showConfirmationDialogState = useState(false);
  const [, setShowConfirmationDialog] = showConfirmationDialogState;
  const showConfirmationDialog = () => setShowConfirmationDialog(true);

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

  const updateCollectionGoal = (
    collectorId: string,
    collectionGoal: number
  ) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          "/UpdateCollectorGoal",
          { collectionGoal },
          {
            params: { collectorId },
            ...sharedAxiosConfig,
          }
        )
        .then(() => {
          showGlobalSnackbar("Indsamlingsmål opdateret");
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  };

  return (
    <View style={styles.collectorContainer}>
      <Text>{collector.displayName}</Text>
      <View style={styles.actionContainer}>
        <FormContainer
          initialValues={{ collectionGoal: collector.collectionGoal }}
          onSubmit={async (values) =>
            updateCollectionGoal(collector.id, values.collectionGoal)
          }
          validationSchema={collectionGoalSchema}
          validateOnMount
          style={styles.updateGoalContainer}
        >
          <NumberField
            formKey="collectionGoal"
            key={collector.id}
            label="Indsamlingsmål"
          />
          <SubmitButton title="Opdater" />
        </FormContainer>
        <Button title="Slet bruger" onPress={showConfirmationDialog} />
      </View>
      <ConfirmationDialog
        description="Indsamleren fjernes fra clusteret og slettes fra MyTrash"
        showState={showConfirmationDialogState}
        actionToConfirm={deleteUser}
      />
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
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  updateGoalContainer: {
    // NB! Be explicit to indicate that it differs from the other containers
    flexDirection: "column",
    margin: 5,
  },
});

export default CollectorList;
