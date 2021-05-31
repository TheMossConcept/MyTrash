import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Cluster } from "../components/shared/ClusterList";
import useAxiosConfig from "./useAxiosConfig";

/* NB! Be aware that even though this pattern is convinient, it will lead to
 * unnecessary repeat queries. It is not an issue at the moment, however, it
 * can be once the app grows. When that happens, consider caching!
 */
const useClusters = (queryParams?: Object) => {
  const sharedAxiosConfig = useAxiosConfig();
  const [clusters, setClusters] = useState<Cluster[]>([]);

  const fetchClusters = useCallback(() => {
    axios
      .get("GetClusters", {
        params: queryParams,
        ...sharedAxiosConfig,
      })
      .then((clustersResult) => {
        setClusters(clustersResult.data);
      });
    // TODO: Fix this by storing in local state and checking for object equality before updating value!
  }, [sharedAxiosConfig]);

  // Fetch whenever the function updates!
  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  return { clusters, refetchClusters: fetchClusters };
};

export default useClusters;
