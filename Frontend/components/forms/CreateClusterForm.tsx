import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";
import DismissableSnackbar from "../shared/DismissableSnackbar";
import ClusterForm, { ClusterFormData } from "./ClusterForm";

type UpdateFormProps = {
  successCallback?: () => void;
  clusterId?: string;
};

export const UpdateCluster: FC<UpdateFormProps> = ({
  clusterId,
  successCallback,
}) => {
  const [initialValues, setInitialValues] = useState<
    ClusterFormData | undefined
  >(undefined);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

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

  const updateCluster = (values: ClusterFormData, reset: () => void) => {
    if (accessToken) {
      axios
        .put("/UpdateCluster", values, {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then(() => {
          setShowSuccessSnackbar(true);
          reset();
          if (successCallback) {
            successCallback();
          }
        });
    }
  };

  return initialValues ? (
    <View>
      <ClusterForm
        cluster={initialValues}
        submit={updateCluster}
        submitTitle="Opdater cluster"
      />
      <DismissableSnackbar
        title="Clusteret blev opdateret"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  ) : (
    <ActivityIndicator />
  );
};

type CreateFormProps = {
  successCallback?: () => void;
};

export const CreateCluster: FC<CreateFormProps> = ({ successCallback }) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

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
          setShowSuccessSnackbar(true);
          reset();
          if (successCallback) {
            successCallback();
          }
        });
    }
  };

  return (
    <View>
      <ClusterForm
        cluster={initialValues}
        submit={createCluster}
        submitTitle="Opret cluster"
      />
      <DismissableSnackbar
        title="Clusteret blev oprettet"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  );
};
