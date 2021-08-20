import React, { FC, useContext, useState } from "react";
import * as yup from "yup";
import { isEmpty, isArray } from "lodash";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import GlobalSnackbarContext from "../../utils/globalContext";
import HeadlineText from "../styled/HeadlineText";
import LoadingIndicator from "../styled/LoadingIndicator";
import globalStyles from "../../utils/globalStyles";
import WebButton from "../styled/WebButton";

type Props = {
  collectors: Collector[];
  isLoading: boolean;
  refetch: () => void;
  // Ideally, this should NOT appear in the collector list props,
  // however, it makes it much easier for the backend on collector
  // deletion
  clusterId: string;
};

export type Collector = {
  displayName: string;
  id: string;
  collectionGoal: number;
};

const CollectorList: FC<Props> = ({
  collectors,
  isLoading,
  refetch,
  clusterId,
}) => {
  return (
    <View>
      <HeadlineText style={styles.leftText} text="Indsamlere." />
      {/* eslint-disable no-nested-ternary */}
      {isLoading ? (
        <LoadingIndicator />
      ) : isEmpty(collectors) || !isArray(collectors) ? (
        <Text style={[globalStyles.subheaderText, styles.leftText]}>
          Ingen indsamlere tilføjede.
        </Text>
      ) : (
        collectors.map((collector) => (
          <CollectorView
            collector={collector}
            clusterId={clusterId}
            key={collector.id}
            deletionCallback={refetch}
          />
        ))
      )}
      {/* eslint-enable no-nested-ternary */}
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
    <View style={styles.container}>
      <View style={styles.collectorContainer}>
        <Text style={globalStyles.subheaderText}>{collector.displayName}</Text>
      </View>
      <FormContainer
        initialValues={{ collectionGoal: collector.collectionGoal }}
        onSubmit={async (values) =>
          updateCollectionGoal(collector.id, values.collectionGoal)
        }
        validationSchema={collectionGoalSchema}
        style={styles.formContainer}
        validateOnMount
      >
        <NumberField
          formKey="collectionGoal"
          key={collector.id}
          label="Mål i kg"
          style={styles.formItem}
        />
        <View style={styles.actionsContainer}>
          <SubmitButton title="Opdater" style={styles.formItem} isWeb />
          <WebButton
            text="Slet bruger"
            onPress={showConfirmationDialog}
            style={styles.lastFormItem}
            disabled={false}
          />
        </View>
      </FormContainer>
      <ConfirmationDialog
        description="Indsamleren fjernes fra clusteret og slettes fra MyTrash"
        showState={showConfirmationDialogState}
        actionToConfirm={deleteUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
  },
  collectorContainer: { alignItems: "center" },
  formContainer: { flexDirection: "row", alignItems: "center" },
  actionsContainer: { flex: 1, flexDirection: "row" },
  formItem: { flex: 1, marginRight: 10 },
  lastFormItem: { flex: 1 },
  leftText: {
    alignItems: "flex-start",
    marginLeft: 0,
  },
  updateButton: { marginBottom: 10 },
});

export default CollectorList;
