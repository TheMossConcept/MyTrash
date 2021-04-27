import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import axiosUtils from "../utils/axios";

import useAccessToken from "../hooks/useAccessToken";
import { TabsParamList } from "../typings/types";
import PlasticCollectionList, {
  CollectionWithStatusType,
} from "../components/PlasticCollectionList";

type Props = StackScreenProps<TabsParamList, "Logistik">;

const LogisticsScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    CollectionWithStatusType[]
  >([]);
  const accessToken = useAccessToken();

  useEffect(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { logisticsPartnerId: userId },
        ...axiosUtils.getSharedAxiosConfig(accessToken),
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [accessToken, userId]);
  // NB: This needs to be its own component for use in both the logistics screen and the collection screen.
  // Make it so that it takes a list of collection statuses and only display those in the list. It should also
  // take a boolean value indicating whether or not it should be interactable (pick the one from the PlasticCollection props
  return (
    <PlasticCollectionList
      collections={plasticCollections}
      showSections={["pending", "scheduled", "delivered", "received"]}
      interactable
    />
  );
};

export default LogisticsScreen;
