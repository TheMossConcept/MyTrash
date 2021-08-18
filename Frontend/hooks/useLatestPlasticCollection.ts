import axios from "axios";
import { useContext, useState } from "react";
import { CollectionStatusData } from "../components/collection/CollectionStatusPopover";
import { CollectionFormData } from "../components/collection/OrderCollectionForm";
import GlobalSnackbarContext from "../utils/globalContext";
import useAxiosConfig from "./useAxiosConfig";
import useQueriedData from "./useQueriedData";

type ReturnValue = {
  update?: (newValues: CollectionFormData) => void;
  formValues?: CollectionFormData;
  statusValues?: CollectionStatusData;
  collectionIsOver?: boolean;
  loading: boolean;
  refresh: () => void;
};

type CollectionData = CollectionFormData &
  CollectionStatusData & { _id: string };

const useLatestPlasticCollection = (collectorId: string): ReturnValue => {
  const { refetch: getLatestCollection, isLoading: loading } =
    useQueriedData<CollectionData>("/GetLatestCollection", { collectorId });

  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const [existingCollection, setExistingCollection] =
    useState<CollectionData>();
  const sharedAxiosConfig = useAxiosConfig();

  const collectionHasYetToBeHandled =
    existingCollection?.collectionStatus === "pending" ||
    existingCollection?.collectionStatus === "scheduled";

  if (existingCollection && collectionHasYetToBeHandled) {
    const updateCollectionRequest = (values: CollectionFormData) => {
      axios
        .put("/UpdatePlasticCollection", values, {
          ...sharedAxiosConfig,
          /* eslint-disable-next-line no-underscore-dangle */
          params: { collectionId: existingCollection._id },
        })
        .then((response) => {
          setExistingCollection(response.data);
          showGlobalSnackbar("Afhentning redigeret");
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      update: updateCollectionRequest,
      statusValues: existingCollection,
      formValues: existingCollection,
      loading,
      // If the last collection has been handled, the collection is over
      collectionIsOver:
        !collectionHasYetToBeHandled && existingCollection.isLastCollection,
      refresh: getLatestCollection,
    };
  }

  return {
    refresh: getLatestCollection,
    loading,
    statusValues: existingCollection,
  };
};

export default useLatestPlasticCollection;
