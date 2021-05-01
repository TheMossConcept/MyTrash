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
  const { clusterId } = req.query as Payload;

  const cluster = await databaseAPI.findById<ClusterEntity>(
    "cluster",
    clusterId
  );

  // TODO: This type should automatically be inferred!
  const batchesForCluster: BatchFromDb[] = await databaseAPI.find<BatchFromDb>(
    "batch",
    clusterId ? { clusterId: { $exists: true, $eq: clusterId } } : {}
  );

  const returnValuePromises = batchesForCluster.map(async (batch) => {
    // NB! The recipient partner is always the creator
    const creator = await databaseAPI.findOne<UserMetadataEntity>(
      "userMetadata",
      { azureAdId: cluster.recipientPartnerId }
    );

    const productionPartner = await databaseAPI.findOne<UserMetadataEntity>(
      "userMetadata",
      { azureAdId: cluster.productionPartnerId }
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
      `Batch creator or recipient could not be found for batch linked to cluster with id ${clusterId} or their company name was not set`
    );
  });

  const returnValue = await Promise.all(returnValuePromises);

  context.res = {
    body: JSON.stringify(returnValue),
  };
};

type Payload = {
  clusterId: string;
};

export default httpTrigger;
