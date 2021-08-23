import { AzureFunction, Context } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import databaseAPI, {
  ClusterEntity,
  BatchEntity,
  CollectionEntity,
  ProductEntity,
} from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  try {
    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    const closedClusters = await databaseAPI.find<ClusterEntity>("cluster", {
      closedForCollection: { $exists: true, $eq: true },
    });

    closedClusters.forEach(async (closedCluster) => {
      closedCluster.collectors.forEach(async (collectorId) => {
        await client.api(`/users/${collectorId}`).delete();
      });
      /* eslint-disable no-underscore-dangle */
      await databaseAPI.remove<CollectionEntity>("collection", {
        clusterId: { $exists: true, $eq: closedCluster._id.toString() },
      });

      await databaseAPI.remove<BatchEntity>("batch", {
        clusterId: { $exists: true, $eq: closedCluster._id.toString() },
      });

      await databaseAPI.remove<ProductEntity>("product", {
        clusterId: { $exists: true, $eq: closedCluster._id.toString() },
      });
      /* eslint-enable no-underscore-dangle */
    });

    const removeResult = await databaseAPI.remove<ClusterEntity>("cluster", {
      closedForCollection: { $exists: true, $eq: true },
    });

    context.res = {
      body: JSON.stringify(removeResult),
    };
  } catch (error) {
    // TODO: Change this to some error logging when we make the function time-triggered instead
    context.res = {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export default httpTrigger;
