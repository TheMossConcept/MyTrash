import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { ClusterFormData } from "../components/cluster/ClusterForm";
import { Cluster } from "../components/cluster/ClusterList";
import useAxiosConfig from "./useAxiosConfig";

type FullCluster = Cluster & ClusterFormData;

/* NB! Be aware that even though this pattern is convinient, it will lead to
 * unnecessary repeat queries. It is not an issue at the moment, however, it
 * can be once the app grows. When that happens, consider caching!
 */
const useClusters = (queryParams?: Object, page?: number) => {
  const sharedAxiosConfig = useAxiosConfig();
  const [clusters, setClusters] = useState<FullCluster[]>([]);

  const fetchClusters = useCallback(() => {
    axios
      .get("GetClusters", {
        params: { ...queryParams, page },
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
