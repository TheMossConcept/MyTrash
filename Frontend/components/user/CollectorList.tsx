import React, { FC, useContext, useState } from "react";
import * as yup from "yup";
import { isEmpty, isArray } from "lodash";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import FormContainer from "../shared/FormContainer";
import NumberField from "../inputs/NumberField";
import SubmitButton from "../inputs/SubmitButton";
import GlobalSnackbarContext from "../../utils/globalContext";
import HeadlineText from "../styled/HeadlineText";
import useQueriedData from "../../hooks/useQueriedData";
import LoadingIndicator from "../styled/LoadingIndicator";
import globalStyles from "../../utils/globalStyles";
import WebButton from "../styled/WebButton";

type Props = { clusterId: string };

type Collector = {
  displayName: string;
  id: string;
  collectionGoal: number;
};

const CollectorList: FC<Props> = ({ clusterId }) => {
  const {
    data: collectors,
    refetch: refetchCollectors,
    isLoading,
  } = useQueriedData("/GetCollectors", {
    clusterId,
  });

  return (
    <View>
      {/* eslint-disable no-nested-ternary */}
      {isLoading ? (
        <LoadingIndicator />
      ) : isEmpty(collectors) || !isArray(collectors) ? (
        <HeadlineText text="Ingen indsamlere tilføjet" />
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
    <View style={styles.collectorContainer}>
      <View style={{ flex: 1, marginRight: 10, alignItems: "center" }}>
        <Text style={globalStyles.subheaderText}>{collector.displayName}</Text>
      </View>
      <FormContainer
        initialValues={{ collectionGoal: collector.collectionGoal }}
        onSubmit={async (values) =>
          updateCollectionGoal(collector.id, values.collectionGoal)
        }
        validationSchema={collectionGoalSchema}
        style={{ flex: 2, flexDirection: "row" }}
        validateOnMount
      >
        <View
          style={{
            flex: 1,
            marginRight: 10,
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <NumberField
            formKey="collectionGoal"
            key={collector.id}
            label="Mål"
          />
        </View>
        <View style={styles.actionButtonsContainer}>
          <SubmitButton title="Opdater" style={{ marginBottom: 10 }} isWeb />
          <WebButton
            text="Slet bruger"
            onPress={showConfirmationDialog}
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
  actionButtonsContainer: {
    // NB! Be explicit to indicate that it differs from the other containers
    flexDirection: "column",
    flex: 1,
    margin: 5,
  },
});

export default CollectorList;
