import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { isEqual } from "lodash";
import useAxiosConfig from "./useAxiosConfig";

function useQueriedData<T>(endpoint: string, queryParams?: Object) {
  const [isLoading, setIsLoading] = useState(true);
  const [queryParamsUsed, setQueryParamsUsed] = useState<Object | undefined>(
    // If we let this be undefined, we will never call fetchData in the case where we omit
    // queryParams. Please note that this will still cause the issue (not calling fetchData)
    // if, for some reason, an empty object is passed as queryParams, as queryParamsUsed and
    // queryParams will then be equal initially.
    {}
  );
  const [queriedData, setQueriedData] = useState<T>();

  const sharedAxiosConfig = useAxiosConfig();

  const fetchData = useCallback(() => {
    setIsLoading(true);

    axios
      .get(endpoint, {
        params: queryParams,
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setQueriedData(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // TODO: Figure out a way to include queryParams without having it requery all the time
    // because it is always a new object instance that is passed along (at least for each render
  }, [endpoint, queryParams, sharedAxiosConfig]);

  useEffect(() => {
    // Only fetch as a sideEffect if the queryParams change! (this is mostly for initial
    // fetching and fetching when e.g. the page param changes)
    if (!isEqual(queryParamsUsed, queryParams)) {
      fetchData();
      setQueryParamsUsed(queryParams);
    }
  }, [fetchData, queryParams, queryParamsUsed]);

  return { data: queriedData, refetch: fetchData, isLoading };
}

export default useQueriedData;
