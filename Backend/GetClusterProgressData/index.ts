import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, {
  CollectionEntity,
  ClusterEntity,
} from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { clusterId } = req.query as Payload;
    const allClusterCollections = await databaseAPI.find<CollectionEntity>(
      "collection",
      {
        clusterId: { $exists: true, $eq: clusterId },
      }
    );
    const collectedPlasticAmount = allClusterCollections.reduce(
      (totalAmountCollected, currentValue) => {
        return totalAmountCollected + (currentValue.weight || 0);
      },
      0
    );

    const cluster = await databaseAPI.findById<ClusterEntity>(
      "cluster",
      clusterId
    );
    const { usefulPlasticFactor, necessaryAmountOfPlastic } = cluster;

    const rectifiedCollectionAmount =
      collectedPlasticAmount * usefulPlasticFactor;

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify({
        rectifiedCollectionAmount,
        collectionGoal: necessaryAmountOfPlastic,
      }),
    };
  } catch (error) {
    const body = {
      errorMessage:
        "Der skete en fejl under hentningen af dit data for clusteret",
      rawError: error,
    };

    context.res = {
      body,
      statusCode: 500,
    };
  }
};

type Payload = {
  userId: string;
  clusterId: string;
};

export default httpTrigger;
