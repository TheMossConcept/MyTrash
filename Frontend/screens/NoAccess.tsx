import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { StyleSheet, Text } from "react-native";
import Menu from "../components/shared/Menu";
import HoueLogo from "../components/styled/HoueLogo";
import MainContentArea from "../components/styled/MainContentArea";
import { TabsParamList } from "../typings/types";
import globalStyles from "../utils/globalStyles";

type Props = StackScreenProps<TabsParamList, "NoAccess">;

const NoAccess: FC<Props> = ({ route }) => {
  const text =
    route?.params.text ||
    "Du har desværre ikke adang til løsningen. Kontakt Houe for at løse dette";
  return (
    <MainContentArea>
      <Menu />
      <HoueLogo />
      <Text style={[globalStyles.subheaderText, styles.text]}>{text}</Text>
    </MainContentArea>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 23,
  },
});

export default NoAccess;
