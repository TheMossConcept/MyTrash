import axios from "axios";
import { useContext, useState, useEffect } from "react";
import axiosUtils from "../utils/axios";
import { Cluster } from "../components/shared/ClusterList";
import { AccessTokenContext } from "../navigation/TabNavigator";

const useClusters = (queryParams?: Object) => {
  const accessToken = useContext(AccessTokenContext);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    if (accessToken) {
      axios
        .get("GetClusters", {
          params: queryParams,
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((clustersResult) => {
          setClusters(clustersResult.data);
        });
    }
  }, [accessToken]);

  return clusters;
};

export default useClusters;
