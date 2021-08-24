import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import ClusterForm, { ClusterFormData } from "./ClusterForm";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";
import WebButton, { WebButtonProps } from "../styled/WebButton";
import ConfirmationDialog from "../shared/ConfirmationDialog";
import LoadingIndicator from "../styled/LoadingIndicator";

type UpdateFormProps = {
  successCallback: () => void;
  clusterId?: string;
};

export const UpdateCluster: FC<UpdateFormProps> = ({
  clusterId,
  successCallback,
}) => {
  const [initialValues, setInitialValues] = useState<
    ClusterFormData | undefined
  >(undefined);
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const sharedAxiosConfig = useAxiosConfig();

  useEffect(() => {
    axios
      .get("/GetCluster", {
        params: { clusterId },
        ...sharedAxiosConfig,
      })
      .then((clusterResult) => {
        setInitialValues(clusterResult.data);
      });
  }, [sharedAxiosConfig, clusterId]);

  const updateCluster = (values: ClusterFormData) => {
    axios
      .put("/UpdateCluster", values, {
        params: {
          clusterId,
        },
        ...sharedAxiosConfig,
      })
      .then(() => {
        showGlobalSnackbar("Clusteret blev redigeret");

        successCallback();
      });
  };

  return initialValues ? (
    <ClusterForm
      cluster={initialValues}
      clusterId={clusterId}
      submit={updateCluster}
      title="Rediger cluster"
    />
  ) : (
    <LoadingIndicator />
  );
};

type CreateFormProps = {
  successCallback: () => void;
};

export const CreateCluster: FC<CreateFormProps> = ({ successCallback }) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const initialValues = {
    name: "",
    open: false,
    closedForCollection: false,
    c5Reference: "",
    logisticsPartnerId: "",
    recipientPartnerId: "",
    productionPartnerId: "",
    collectionAdministratorId: "",
  };

  const sharedAxiosConfig = useAxiosConfig();

  const createCluster = (values: ClusterFormData, reset: () => void) => {
    axios.post("/CreateCluster", values, sharedAxiosConfig).then(() => {
      showGlobalSnackbar("Clusteret blev oprettet");
      reset();

      successCallback();
    });
  };

  return (
    <ClusterForm
      cluster={initialValues}
      submit={createCluster}
      title="Opret cluster"
    />
  );
};

type CloseClusterBtnProps = {
  clusterId: string;
  title?: string;
  successCallback?: () => void;
} & Omit<WebButtonProps, "onPress" | "text" | "disabled" | "isSelected">;

export const CloseClusterBtn: FC<CloseClusterBtnProps> = ({
  clusterId,
  successCallback,
  title,
  ...webButtonProps
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const sharedAxiosConfig = useAxiosConfig();

  const closeCluster = () => {
    setIsLoading(true);

    axios
      .post(
        "/CloseCluster",
        {},
        { ...sharedAxiosConfig, params: { clusterId } }
      )
      .then(() => {
        if (successCallback) {
          successCallback();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <WebButton
          onPress={() => setShowConfirmationDialog(true)}
          text={title || "Luk cluster"}
          disabled={false}
          {...webButtonProps}
        />
      )}
      <ConfirmationDialog
        description="Clusteret lukkes og alt data relateret til det slettes efter 30 dage"
        showState={[showConfirmationDialog, setShowConfirmationDialog]}
        actionToConfirm={closeCluster}
      />
    </View>
  );
};

type OpenClusterBtnProps = {
  clusterId: string;
  title?: string;
  successCallback?: () => void;
} & Omit<WebButtonProps, "onPress" | "text" | "disabled" | "isSelected">;

export const OpenClusterBtn: FC<OpenClusterBtnProps> = ({
  clusterId,
  successCallback,
  title,
  ...webButtonProps
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const sharedAxiosConfig = useAxiosConfig();

  const openCluster = () => {
    setIsLoading(true);

    axios
      .put(
        "/ReopenCluster",
        {},
        { ...sharedAxiosConfig, params: { clusterId } }
      )
      .then(() => {
        if (successCallback) {
          successCallback();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <WebButton
          onPress={openCluster}
          text={title || "Åben cluster"}
          disabled={false}
          {...webButtonProps}
        />
      )}
    </View>
  );
};
