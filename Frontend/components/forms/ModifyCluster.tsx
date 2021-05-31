import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { GlobalSnackbarContext } from "../../navigation/TabNavigator";
import ClusterForm, { ClusterFormData } from "./ClusterForm";
import useAxiosConfig from "../../hooks/useAxiosConfig";

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
          code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
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
      submitTitle="Opdater cluster"
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
    c5Reference: "",
    logisticsPartnerId: "",
    recipientPartnerId: "",
    productionPartnerId: "",
    collectionAdministratorId: "",
  };

  const sharedAxiosConfig = useAxiosConfig();

  const createCluster = (values: ClusterFormData, reset: () => void) => {
    axios
      .post("/CreateCluster", values, {
        params: {
          code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
        },
        ...sharedAxiosConfig,
      })
      .then(() => {
        showGlobalSnackbar("Clusteret blev oprettet");
        reset();

        successCallback();
      });
  };

  return (
    <ClusterForm
      cluster={initialValues}
      submit={createCluster}
      submitTitle="Opret cluster"
    />
  );
};
