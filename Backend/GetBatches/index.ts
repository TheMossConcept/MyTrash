import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, {
  UserMetadataEntity,
  BatchEntity,
  ClusterEntity,
} from "../utils/DatabaseAPI";

type BatchFromDb = BatchEntity & { _id: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // TODO: Change clusterId to recipientPartnerId as we want all batches for a given recipient
  const { recipientPartnerId } = req.query as Payload;
  // TODO: This type should automatically be inferred!
  const batchesForRecipient: BatchFromDb[] = await databaseAPI.find<BatchFromDb>(
    "batch",
    recipientPartnerId
      ? { recipientPartnerId: { $exists: true, $eq: recipientPartnerId } }
      : {}
  );

  const returnValuePromises = batchesForRecipient.map(async (batch) => {
    // NB! The recipient partner is always the creator
    const creator = await databaseAPI.findOne<UserMetadataEntity>(
      "userMetadata",
      { azureAdId: batch.recipientPartnerId }
    );

    const productionPartner = await databaseAPI.findOne<UserMetadataEntity>(
      "userMetadata",
      { azureAdId: batch.productionPartnerId }
    );

    const creatorName = creator?.companyName;
    const recipientName = productionPartner?.companyName;

    const { _id, ...batchToReturn } = batch;

    // TODO: Consider whether we should throw an exception here or just return collection
    if (creatorName && recipientName) {
      return {
        id: _id,
        creatorName,
        recipientName,
        ...batchToReturn,
      };
    }
    throw new Error(
      `Batch creator or recipient could not be found for recipientPartnerId ${batch.recipientPartnerId} or productionPartnerId ${batch.productionPartnerId} or their company name was not set`
    );
  });

  const returnValue = await Promise.all(returnValuePromises);

  context.res = {
    body: JSON.stringify(returnValue),
  };
};

type Payload = {
  recipientPartnerId: string;
};

export default httpTrigger;
