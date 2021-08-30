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

    // Please note that this is the client id of the b2c-extensions-app and NOT of the actual app registration itself!
    // Also note that the -'s have been removed
    const clientId = process.env.ClientId;

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
      collectedPlasticAmount * (usefulPlasticFactor / 100);

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify({
        rectifiedCollectionAmount,
        collectionGoal,
      }),
    };
  } catch (error) {
    const body = JSON.stringify({
      errorMessage:
        "Der skete en fejl under hentningen af din personlige indsamlingsfremgang",
      rawError: error,
    });

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
