import { PlasticCollection } from "../components/collections/PlasticCollectionsDetails";

export default function sortCollectionsByStatus(
  plasticCollections: PlasticCollection[]
) {
  const sortedCollections = plasticCollections.reduce<{
    pending: PlasticCollection[];
    scheduled: PlasticCollection[];
    delivered: PlasticCollection[];
    received: PlasticCollection[];
  }>(
    (accumulator, collection) => {
      const { collectionStatus } = collection;
      switch (collectionStatus) {
        case "pending":
          return {
            ...accumulator,
            pending: [...accumulator.pending, collection],
          };
        case "scheduled":
          return {
            ...accumulator,
            scheduled: [...accumulator.scheduled, collection],
          };
        case "delivered":
          return {
            ...accumulator,
            delivered: [...accumulator.delivered, collection],
          };
        case "received":
          return {
            ...accumulator,
            received: [...accumulator.received, collection],
          };
        default:
          // eslint-disable-next-line no-console
          console.warn("Default case in PlasticCollectionList!!");
          return accumulator;
      }
    },
    { pending: [], scheduled: [], delivered: [], received: [] }
  );

  return sortedCollections;
}
