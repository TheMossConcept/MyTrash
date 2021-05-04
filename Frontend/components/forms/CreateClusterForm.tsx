import axios from "axios";
import React, { FC, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";
import ClusterForm from "./ClusterForm";

type ClusterFormData = {
  isOpen: boolean;
  name: string;
  c5Reference: string;
  necessaryPlastic?: number;
  usefulPlasticFactor?: number;
  productionPartnerId?: string;
  collectionAdministratorId?: string;
  logisticsPartnerId?: string;
  recipientPartnerId?: string;
};

type UpdateFormProps = {
  onUpdate?: () => void;
  clusterId?: string;
};

const UpdateForm: FC<UpdateFormProps> = () => {
  return <></>;
};

type CreateFormProps = {
  successCallback?: () => void;
};

const CreateCluster: FC<CreateFormProps> = ({ successCallback }) => {
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

  const createCluster = (values: ClusterFormData) => {
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
          if (successCallback) {
            successCallback();
          }
        });
    }
  };

  return <ClusterForm cluster={initialValues} submit={createCluster} />;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    zIndex: 1,
  },
  inputColumn: {
    flex: 1,
    padding: 5,
  },
});

export default CreateCluster;
