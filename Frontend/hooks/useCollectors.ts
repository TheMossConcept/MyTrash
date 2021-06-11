import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import useAxiosConfig from "./useAxiosConfig";

// This is the hook that handles querying, so therefore it makes sense
// that it define the type until we get end-to-end typings
export type Collector = {
  displayName: string;
  id: string;
};

// NB! All these data querying hooks can easily be reused by simply including the endpoint
// as a parameter and renaming the variables to something generic

/* NB! Be aware that even though this pattern is convinient, it will lead to
 * unnecessary repeat queries. It is not an issue at the moment, however, it
 * can be once the app grows. When that happens, consider caching!
 */
const useCollectors = (queryParams?: Object, page?: number) => {
  const sharedAxiosConfig = useAxiosConfig();
  const [collectors, setCollectors] = useState<Collector[]>([]);

  const fetchCollectors = useCallback(() => {
    axios
      .get("GetCollectors", {
        params: { ...queryParams, page },
        ...sharedAxiosConfig,
      })
      .then((clustersResult) => {
        setCollectors(clustersResult.data);
      });
    // TODO: Fix this by storing in local state and checking for object equality before updating value!
  }, [sharedAxiosConfig]);

  // Fetch whenever the function updates!
  useEffect(() => {
    fetchCollectors();
  }, [fetchCollectors]);

  return { collectors, refetchCollectors: fetchCollectors };
};

export default useCollectors;
