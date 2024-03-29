import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";
import { isEqual } from "lodash";
import useAxiosConfig from "./useAxiosConfig";

type CacheObject<T = any> = {
  creationTime: string;
  data: T;
};

const CACHE_EXPIRATION_IN_MINUTES = 10;

function useQueriedData<T>(endpoint: string, queryParams?: Object) {
  const [isLoading, setIsLoading] = useState(false);
  // This is to avoid an infinite loop if an error occurs and the fetchDataIfNecessary function is called
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [queriedData, setQueriedData] = useState<T>();

  const cacheKey = `${endpoint}${
    queryParams ? JSON.stringify(queryParams) : ""
  }`;

  const updateCache = useCallback(
    (data: T) => {
      const creationTime = DateTime.now();
      const cacheObject: CacheObject<T> = {
        creationTime: creationTime.toString(),
        data,
      };
      AsyncStorage.setItem(cacheKey, JSON.stringify(cacheObject));
    },
    [cacheKey]
  );

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

        updateCache(data);
        setQueriedData(data);
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
  }, [endpoint, queryParams, sharedAxiosConfig, updateCache]);

  // Reset error occurred state every time we make a new request
  useEffect(() => {
    setErrorOccurred(false);
  }, [cacheKey]);

  useEffect(() => {
    const fetchDataIfNecessary = async () => {
      const rawCacheResult = await AsyncStorage.getItem(cacheKey);
      const cacheObject: CacheObject | undefined = rawCacheResult
        ? JSON.parse(rawCacheResult)
        : undefined;

      const creationTime = cacheObject
        ? DateTime.fromISO(cacheObject.creationTime)
        : undefined;
      const now = DateTime.now();

      const cacheHasExpired = creationTime
        ? creationTime.until(now).length("minute") >=
          CACHE_EXPIRATION_IN_MINUTES
        : false;

      const cacheMissingOrInvalid = !cacheObject || cacheHasExpired;

      if (cacheMissingOrInvalid && !isLoading && !errorOccurred) {
        fetchData();
      } else if (cacheObject?.data && !isEqual(queriedData, cacheObject.data)) {
        setQueriedData(cacheObject.data);
      }
    };

    fetchDataIfNecessary();
    // The cache key changes when the query params change, and therefore it causes a re-render
  }, [fetchData, cacheKey, isLoading, queriedData, errorOccurred]);

  return { data: queriedData, refetch: fetchData, updateCache, isLoading };
}

export default useQueriedData;
