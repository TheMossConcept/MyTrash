import React, { FC, useState } from "react";
import { Button, View } from "react-native";
import NumericInput from "../inputs/NumericInput";

type Props = { plasticCollectionId: string };

const DeliverPlasticCollection: FC<Props> = () => {
  const [weight, setWeight] = useState<number | undefined>(undefined);

  const registerDelivery = () => console.log("Not implemented yet");

  return (
    <View>
      <NumericInput label="Vægt" numberState={[weight, setWeight]} />
      <Button title="Register aflevering" onPress={registerDelivery} />
    </View>
  );
};

export default DeliverPlasticCollection;
