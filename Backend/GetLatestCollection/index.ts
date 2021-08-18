import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";

// NB! This requires a database index for createdAt on the "collection" collection in order to work!!
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { collectorId } = req.query as Payload;

    // TODO: We should only fetch one as we are only ever interested in one
    const requesterCollections: CollectionEntity[] = await databaseAPI.find<CollectionEntity>(
      "collection",
      {
        requesterId: { $exists: true, $eq: collectorId },
      },
      { createdAt: -1 }
    );

    // We know that the first collection is the latest because ofthe sorting
    const latestRequesterCollection = requesterCollections[0];

    context.res = {
      body: JSON.stringify(latestRequesterCollection),
    };
  } catch (error) {
    context.res = {
      body: JSON.stringify(error),
      statusCode: 500,
    };
  }
};

type Payload = {
  collectorId: string;
};

export default httpTrigger;
