import axios from "axios";
import React, { FC, useState } from "react";
import { Button, View } from "react-native";
import useAccessToken from "../../hooks/useAccessToken";
import { CollectionFormData } from "../forms/OrderCollectionForm";
import DismissableSnackbar from "../shared/DismissableSnackbar";
import axiosUtils from "../../utils/axios";

type Props = {
  clusterId: string;
  userId: string;
  collectionFormData: CollectionFormData;
};

const OrderCollectionButton: FC<Props> = ({
  clusterId,
  userId,
  collectionFormData,
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const accessToken = useAccessToken();
  const createCollectionRequest = () => {
    axios
      .post(
        "/CreatePlasticCollection",
        { clusterId, requesterId: userId, ...collectionFormData },
        { ...axiosUtils.getSharedAxiosConfig(accessToken) }
      )
      .then(() => {
        setShowSuccessSnackbar(true);
      });
  };
  return (
    <View>
      <Button title="Bestil afhentning" onPress={createCollectionRequest} />
      <DismissableSnackbar
        title="Afhentning bestilt"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  );
};

export default OrderCollectionButton;
