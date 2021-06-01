import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import {
  AccessTokenContext,
  GlobalSnackbarContext,
} from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";
import CategoryHeadline from "../styled/Subheader";
import ClusterForm, { ClusterFormData } from "./ClusterForm";

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

  const accessToken = useContext(AccessTokenContext);

  useEffect(() => {
    if (accessToken) {
      axios
        .get("/GetCluster", {
          params: { clusterId },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((clusterResult) => {
          setInitialValues(clusterResult.data);
        });
    }
  }, [accessToken, clusterId]);

  const updateCluster = (values: ClusterFormData) => {
    if (accessToken) {
      axios
        .put("/UpdateCluster", values, {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
            clusterId,
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then(() => {
          showGlobalSnackbar("Clusteret blev opdateret");

          successCallback();
        });
    }
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

  const accessToken = useContext(AccessTokenContext);

  const createCluster = (values: ClusterFormData, reset: () => void) => {
    if (accessToken) {
      axios
        .post("/CreateCluster", values, {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then(() => {
          showGlobalSnackbar("Clusteret blev oprettet");
          reset();

          successCallback();
        });
    }
  };

  return (
    <ClusterForm
      cluster={initialValues}
      submit={createCluster}
      submitTitle="Opret cluster"
    />
  );
};
