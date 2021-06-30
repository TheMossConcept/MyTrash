import React, { FC } from "react";
import { Text } from "react-native";

type Props = { text: string };

const AppText: FC<Props> = ({ text }) => {
  return (
    <Text
      style={{
        fontSize: 17.5,
        color: "#898c8e",
        fontFamily: "HelveticaNeueLTPro-Bd",
        textAlign: "center",
      }}
    >
      {text}
    </Text>
  );
};

export default AppText;
