import axios from "axios";
import { useContext, useState, useEffect, useCallback } from "react";
import axiosUtils from "../utils/axios";
import { Cluster } from "../components/shared/ClusterList";
import { AccessTokenContext } from "../navigation/TabNavigator";

/* NB! Be aware that even though this pattern is convinient, it will lead to
 * unnecessary repeat queries. It is not an issue at the moment, however, it
 * can be once the app grows. When that happens, consider caching!
 */
const useClusters = (queryParams?: Object) => {
  const accessToken = useContext(AccessTokenContext);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  const fetchClusters = useCallback(() => {
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

  // Fetch whenever the function updates!
  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  return { clusters, refetchClusters: fetchClusters };
};

export default useClusters;
