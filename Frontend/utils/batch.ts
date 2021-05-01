import { Batch } from "../components/batch/BatchDetails";

export default function sortBatchByStatus(batches: Batch[]) {
  const sortedBatches = batches.reduce<{
    created: Batch[];
    sent: Batch[];
    received: Batch[];
  }>(
    (accumulator, batch) => {
      const { batchStatus } = batch;

      switch (batchStatus) {
        case "created":
          return {
            ...accumulator,
            created: [...accumulator.created, batch],
          };
        case "sent":
          return {
            ...accumulator,
            sent: [...accumulator.sent, batch],
          };
        case "received":
          return {
            ...accumulator,
            received: [...accumulator.received, batch],
          };
        default:
          // eslint-disable-next-line no-console
          console.warn("Default case in PlasticCollectionList!!");
          return accumulator;
      }
    },
    { created: [], sent: [], received: [] }
  );

  return sortedBatches;
}
