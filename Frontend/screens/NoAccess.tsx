import React, { FC } from "react";
import { Text } from "react-native";

type Props = {};

const NoAccess: FC<Props> = () => {
  return (
    <Text>
      Du har desværre ikke adang til løsningen. Kontakt Houe for at løse dette
    </Text>
  );
};

export default NoAccess;
