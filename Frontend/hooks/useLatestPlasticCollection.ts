import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CollectionStatusData } from "../components/collection/CollectionStatusPopover";
import { CollectionFormData } from "../components/collection/OrderCollectionForm";
import GlobalSnackbarContext from "../utils/globalContext";
import useAxiosConfig from "./useAxiosConfig";

type ReturnValue = {
  update?: (newValues: CollectionFormData) => void;
  formValues?: CollectionFormData;
  statusValues?: CollectionStatusData;
  collectionIsOver?: boolean;
  refresh: () => void;
};

type CollectionData = CollectionFormData &
  CollectionStatusData & { _id: string };

const useLatestPlasticCollection = (collectorId: string): ReturnValue => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const [existingCollection, setExistingCollection] =
    useState<CollectionData>();
  const sharedAxiosConfig = useAxiosConfig();

  const getLatestCollection = () => {
    axios
      .get("/GetLatestCollection", {
        ...sharedAxiosConfig,
        params: { collectorId },
      })
      .then((response) => {
        if (response.data) {
          setExistingCollection(response.data);
        }
      });
  };

  // Try getting the latest collection initially
  useEffect(() => {
    getLatestCollection();
  }, []);

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
          showGlobalSnackbar("Afhentning opdateret");
        });
    };

    return {
      update: updateCollectionRequest,
      statusValues: existingCollection,
      formValues: existingCollection,
      // If the last collection has been handled, the collection is over
      collectionIsOver:
        !collectionHasYetToBeHandled && existingCollection.isLastCollection,
      refresh: getLatestCollection,
    };
  }

  return { refresh: getLatestCollection, statusValues: existingCollection };
};

export default useLatestPlasticCollection;