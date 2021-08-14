import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEqual } from "lodash";
import useAxiosConfig from "./useAxiosConfig";

function useQueriedData<T>(endpoint: string, queryParams?: Object) {
  const [isLoading, setIsLoading] = useState(false);
  const [queriedData, setQueriedData] = useState<T>();

  const memorizedQueryParams: Object | undefined = useMemo(() => {
    const previousQueryParams = queryParams;
    if (isEqual(previousQueryParams, queryParams)) {
      return memorizedQueryParams;
    }

    return queryParams;
  }, [queryParams]);

  const cacheKey = `${endpoint}${JSON.stringify(queryParams)})`;

  const sharedAxiosConfig = useAxiosConfig();

  const fetchData = useCallback(() => {
    setIsLoading(true);

    axios
      .get(endpoint, {
        params: memorizedQueryParams,
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;

        AsyncStorage.setItem(cacheKey, JSON.stringify(data));
        setQueriedData(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // TODO: Figure out a way to include queryParams without having it requery all the time
    // because it is always a new object instance that is passed along (at least for each render
  }, [cacheKey, endpoint, memorizedQueryParams, sharedAxiosConfig]);

  useEffect(() => {
    const fetchIfNecessary = async () => {
      // Only fetch as a sideEffect if the queryParams change! (this is mostly for initial
      // fetching and fetching when e.g. the page param changes)
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (!cachedData) {
        fetchData();
      } else {
        setQueriedData(JSON.parse(cachedData) as T);
      }
    };

    fetchIfNecessary();
  }, [cacheKey, fetchData]);

  return { data: queriedData, refetch: fetchData, isLoading };
}

export default useQueriedData;
