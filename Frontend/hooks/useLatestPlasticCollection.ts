import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CollectionStatusData } from "../components/collection/CollectionStatusPopover";
import { CollectionFormData } from "../components/collection/OrderCollectionForm";
import GlobalSnackbarContext from "../utils/globalContext";
import useAxiosConfig from "./useAxiosConfig";
import useQueriedData from "./useQueriedData";

type ReturnValue = {
  update?: (newValues: CollectionFormData) => Promise<CollectionData>;
  formValues: CollectionFormData;
  statusValues?: CollectionStatusData;
  collectionIsOver?: boolean;
  loading: boolean;
  refresh: () => void;
};

type CollectionFormDataWithId = CollectionFormData & { _id: string };
type CollectionData = CollectionFormDataWithId & CollectionStatusData;

const useLatestPlasticCollection = (collectorId: string): ReturnValue => {
  const {
    data: existingCollection,
    refetch: getLatestCollection,
    updateCache,
    isLoading: loading,
  } = useQueriedData<CollectionData>("/GetLatestCollection", { collectorId });

  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const [existingFormData, setExistingFormData] =
    useState<CollectionFormDataWithId>({
      _id: "",
      comment: "",
      isLastCollection: false,
    });
  const [existingStatusData, setExistingStatusData] =
    useState<CollectionStatusData>();

  const collectionHasYetToBeHandled =
    existingStatusData?.collectionStatus === "pending";

  useEffect(() => {
    if (existingCollection && collectionHasYetToBeHandled) {
      setExistingFormData(existingCollection);
    } else {
      setExistingFormData({
        _id: "",
        comment: "",
        isLastCollection: false,
      });
    }

    setExistingStatusData(existingCollection);
  }, [collectionHasYetToBeHandled, existingCollection]);

  const sharedAxiosConfig = useAxiosConfig();

  /* eslint-disable-next-line no-underscore-dangle */
  if (existingFormData._id && collectionHasYetToBeHandled) {
    const updateCollectionRequest = (values: CollectionFormData) => {
      return new Promise<CollectionData>((resolve, reject) => {
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

            updateCache(response.data);
            resolve(response.data);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
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
