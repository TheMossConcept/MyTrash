import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import useAxiosConfig from "./useAxiosConfig";

export type AppRole = {
  displayName: string;
  multilineDisplayName: string;
  id: string;
};

/* NB! Be aware that even though this pattern is convinient, it will lead to
 * unnecessary repeat queries. It is not an issue at the moment, however, it
 * can be once the app grows. When that happens, consider caching!
 */
const useAppRoles = (queryParams?: Object) => {
  const sharedAxiosConfig = useAxiosConfig();
  const [appRoles, setAppRoles] = useState<AppRole[]>([]);

  const fetchAppRoles = useCallback(() => {
    axios
      .get("GetAppRoles/", {
        params: queryParams,
        ...sharedAxiosConfig,
      })
      .then((clustersResult) => {
        setAppRoles(clustersResult.data);
      });
  }, [sharedAxiosConfig]);

  // Fetch whenever the function updates!
  useEffect(() => {
    fetchAppRoles();
  }, [fetchAppRoles]);

  return { appRoles, refetchAppRoles: fetchAppRoles };
};

export default useAppRoles;
