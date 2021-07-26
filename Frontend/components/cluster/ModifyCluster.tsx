import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import ClusterForm, { ClusterFormData } from "./ClusterForm";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";
import WebButton, { WebButtonProps } from "../styled/WebButton";

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
        showGlobalSnackbar("Clusteret blev opdateret");

        successCallback();
      });
  };

  return initialValues ? (
    <ClusterForm
      cluster={initialValues}
      clusterId={clusterId}
      submit={updateCluster}
      title="Opdater cluster"
    />
  ) : (
    <ActivityIndicator />
  );
};

type CreateFormProps = {
  successCallback: () => void;
};

export const CreateCluster: FC<CreateFormProps> = ({ successCallback }) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const initialValues = {
    name: "",
    isOpen: false,
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
  const sharedAxiosConfig = useAxiosConfig();

  const closeCluster = () => {
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
      });
  };

  return (
    <WebButton
      onPress={closeCluster}
      text={title || "Luk cluster"}
      disabled={false}
      {...webButtonProps}
    />
  );
};
