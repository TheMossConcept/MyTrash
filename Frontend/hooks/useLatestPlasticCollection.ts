import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { CollectionStatusData } from "../components/collection/CollectionStatusPopover";
import { CollectionFormData } from "../components/collection/OrderCollectionForm";
import GlobalSnackbarContext from "../utils/globalContext";
import useAxiosConfig from "./useAxiosConfig";

type ReturnValue = {
  update?: (newValues: CollectionFormData) => void;
  formValues: CollectionFormData;
  statusValues?: CollectionStatusData;
  collectionIsOver?: boolean;
  loading: boolean;
  refresh: () => void;
};

type CollectionFormDataWithId = CollectionFormData & { _id: string };

const useLatestPlasticCollection = (collectorId: string): ReturnValue => {
  const [loading, setLoading] = useState(false);

  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const [existingFormData, setExistingFormData] =
    useState<CollectionFormDataWithId>({
      _id: "",
      comment: "",
      isLastCollection: false,
    });
  const [existingStatusData, setExistingStatusData] =
    useState<CollectionStatusData>();

  const sharedAxiosConfig = useAxiosConfig();

  const getLatestCollection = useCallback(() => {
    setLoading(true);

    axios
      .get("/GetLatestCollection", {
        ...sharedAxiosConfig,
        params: { collectorId },
      })
      .then((response) => {
        if (response.data) {
          setExistingFormData(response.data);
          setExistingStatusData(response.data);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
      });
  }, []);

  // Try getting the latest collection initially
  useEffect(() => {
    getLatestCollection();
  }, [getLatestCollection]);

  const collectionHasYetToBeHandled =
    existingStatusData?.collectionStatus === "pending" ||
    existingStatusData?.collectionStatus === "scheduled";

  /* eslint-disable-next-line no-underscore-dangle */
  if (existingFormData._id && collectionHasYetToBeHandled) {
    const updateCollectionRequest = (values: CollectionFormData) => {
      axios
        .put("/UpdatePlasticCollection", values, {
          ...sharedAxiosConfig,
          /* eslint-disable-next-line no-underscore-dangle */
          params: { collectionId: existingFormData._id },
        })
        .then((response) => {
          setExistingFormData(response.data);
          setExistingStatusData(response.data);

          showGlobalSnackbar("Afhentning redigeret");
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      update: updateCollectionRequest,
      statusValues: existingStatusData,
      formValues: existingFormData,
      loading,
      // If the last collection has been handled, the collection is over
      collectionIsOver:
        !collectionHasYetToBeHandled && existingFormData.isLastCollection,
      refresh: getLatestCollection,
    };
  }

  return {
    refresh: getLatestCollection,
    loading,
    statusValues: existingStatusData,
    formValues: existingFormData,
  };
};

export default useLatestPlasticCollection;
