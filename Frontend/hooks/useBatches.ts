import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Batch } from "../components/batch/BatchDetails";
import useAxiosConfig from "./useAxiosConfig";

const useBatches = (queryParams?: Object) => {
  const sharedAxiosConfig = useAxiosConfig();
  const [batches, setBatches] = useState<Batch[]>([]);

  const fetchBatches = useCallback(() => {
    axios
      .get("/GetBatches", {
        params: queryParams,
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setBatches(data);
      });
  }, [sharedAxiosConfig]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  return { batches, refetchBatches: fetchBatches };
};

export default useBatches;
