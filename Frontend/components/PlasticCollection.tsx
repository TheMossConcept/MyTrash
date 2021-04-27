import React, { FC } from "react";
import { View } from "react-native";
import { List } from "react-native-paper";

type Props = {};

const PlasticCollection: FC<Props> = () => {
  return (
    <View>
      <List.Section>
        <List.Subheader>Afventer</List.Subheader>
      </List.Section>
      <List.Section>
        <List.Subheader>Afleveret</List.Subheader>
      </List.Section>
      <List.Section>
        <List.Subheader>Bekræftet</List.Subheader>
      </List.Section>
    </View>
  );
};

export default PlasticCollection;
