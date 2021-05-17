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
    const { clusterId, userId } = req.query as Payload;
    const allUserCollections = await databaseAPI.find<CollectionEntity>(
      "collection",
      {
        $and: [
          { clusterId: { $exists: true, $eq: clusterId } },
          { requesterId: { $exists: true, $eq: userId } },
        ],
      }
    );
    const collectedPlasticAmount = allUserCollections.reduce(
      (totalAmountCollected, currentValue) => {
        return totalAmountCollected + (currentValue.weight || 0);
      },
      0
    );

    const cluster = await databaseAPI.findById<ClusterEntity>(
      "cluster",
      clusterId
    );
    const {
      collectors,
      usefulPlasticFactor,
      necessaryAmountOfPlastic,
    } = cluster;

    const rectifiedCollectionAmount =
      collectedPlasticAmount * usefulPlasticFactor;
    const collectionGoal = necessaryAmountOfPlastic / collectors.length;

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify({ rectifiedCollectionAmount, collectionGoal }),
    };
  } catch (e) {
    context.res = {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};

type Payload = {
  userId: string;
  clusterId: string;
};

export default httpTrigger;

