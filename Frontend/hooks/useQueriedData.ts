import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import { isEqual } from "lodash";
import useAxiosConfig from "./useAxiosConfig";

type CacheObject<T = any> = {
  expiration: DateTime;
  data: T;
};

function useQueriedData<T>(endpoint: string, queryParams?: Object) {
  const [isLoading, setIsLoading] = useState(false);
  // This is to avoid an infinite loop if an error occurs and the fetchDataIfNecessary function is called
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [queriedData, setQueriedData] = useState<T>();

  const cacheKey = `${endpoint}${JSON.stringify(queryParams)}`;

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

        const cacheExpiration = DateTime.now().plus({ minutes: 10 });
        const cacheObject: CacheObject<T> = {
          expiration: cacheExpiration,
          data,
        };
        AsyncStorage.setItem(cacheKey, JSON.stringify(cacheObject));
      })
      .catch((error) => {
        console.log(error);
        setErrorOccurred(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // TODO: Figure out a way to include queryParams without having it requery all the time
    // because it is always a new object instance that is passed along (at least for each render
  }, [endpoint, queryParams, sharedAxiosConfig, cacheKey]);

  useEffect(() => {
    const fetchDataIfNecessary = async () => {
      const rawCacheResult = await AsyncStorage.getItem(cacheKey);
      const cacheObject: CacheObject | undefined = rawCacheResult
        ? JSON.parse(rawCacheResult)
        : undefined;

      const cacheMissingOrInvalid =
        !cacheObject || cacheObject?.expiration < DateTime.now();

      if (cacheMissingOrInvalid && !isLoading && !errorOccurred) {
        fetchData();
      } else if (cacheObject?.data && !isEqual(queriedData, cacheObject.data)) {
        setQueriedData(cacheObject.data);
      }

      setErrorOccurred(false);
    };

    fetchDataIfNecessary();
    // The cache key changes when the query params change, and therefore it causes a re-render
  }, [fetchData, cacheKey, isLoading, errorOccurred, queriedData]);

  return { data: queriedData, refetch: fetchData, isLoading };
}

export default useQueriedData;
