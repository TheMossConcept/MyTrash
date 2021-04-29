import axios from "axios";
import React, { FC, useState } from "react";
import { Button, View } from "react-native";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import NumericInput from "../inputs/NumericInput";
import DismissableSnackbar from "../shared/DismissableSnackbar";

type Props = { plasticCollectionId: string };

const DeliverPlasticCollection: FC<Props> = ({ plasticCollectionId }) => {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const accessToken = useAccessToken();
  const registerDelivery = () => {
    axios
      .post(
        "/RegisterPlasticCollectionDelivery",
        { weight },
        {
          params: { collectionId: plasticCollectionId },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        }
      )
      .then(() => setShowSuccessSnackbar(true));
  };

  return (
    <View>
      <NumericInput label="Vægt" numberState={[weight, setWeight]} />
      <Button title="Register aflevering" onPress={registerDelivery} />
      <DismissableSnackbar
        title="Aflevering registreret"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  );
};

export default DeliverPlasticCollection;
