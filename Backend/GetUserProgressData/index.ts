import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import databaseAPI, {
  CollectionEntity,
  ClusterEntity,
} from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { clusterId, userId } = req.query as Payload;

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // TODO: Fix the hardcoding
    const clientId = "efe81d2e0be34a3e87eb2cffd57626ce";

    const collector = await client
      .api(`/users/${userId}?$select=extension_${clientId}_CollectionGoal`)
      .get();

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
      usefulPlasticFactor,
      collectors,
      necessaryAmountOfPlastic,
    } = cluster;

    const collectionGoal =
      collector[`extension_${clientId}_CollectionGoal`] ||
      necessaryAmountOfPlastic / collectors.length;

    const rectifiedCollectionAmount =
      collectedPlasticAmount * usefulPlasticFactor;

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify({
        rectifiedCollectionAmount,
        collectionGoal,
      }),
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

