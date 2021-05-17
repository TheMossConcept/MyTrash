import axios from "axios";
import { useContext, useState, useEffect, useCallback } from "react";
import axiosUtils from "../utils/axios";
import { AccessTokenContext } from "../navigation/TabNavigator";

export type AppRole = {
  displayName: string;
  id: string;
};

/* NB! Be aware that even though this pattern is convinient, it will lead to
 * unnecessary repeat queries. It is not an issue at the moment, however, it
 * can be once the app grows. When that happens, consider caching!
 */
const useAppRoles = (queryParams?: Object) => {
  const accessToken = useContext(AccessTokenContext);
  const [appRoles, setAppRoles] = useState<AppRole[]>([]);

  const fetchAppRoles = useCallback(() => {
    if (accessToken) {
      axios
        .get("GetAppRoles/", {
          params: queryParams,
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((clustersResult) => {
          setAppRoles(clustersResult.data);
        });
    }
  }, [accessToken]);

  // Fetch whenever the function updates!
  useEffect(() => {
    fetchAppRoles();
  }, [fetchAppRoles]);

  return { appRoles, refetchAppRoles: fetchAppRoles };
};

export default useAppRoles;
