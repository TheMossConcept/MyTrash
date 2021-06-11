import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // NB! In the system, it is an invariant that a collector is only ever assigned to one cluster.
  // Consider modelling that better1
  const { clusterId, collectorId } = req.query as QueryParams;

  if (clusterId && collectorId) {
    const clusterEntity = await databaseAPI.findById<ClusterEntity>(
      "cluster",
      clusterId
    );

    // Fail fast if the cluster does not exist or does not fit with the provided cluster id!
    if (!clusterEntity || !clusterEntity.collectors.includes(collectorId)) {
      context.res = {
        statusCode: 400,
        body:
          "Invalid cluster id. The id not match a cluster or the provided collectorId was not associated with that cluster",
      };
    }

    const newCollectorsArray = clusterEntity.collectors.filter(
      (collector) => collector !== collectorId
    );

    await databaseAPI.updateOne<ClusterEntity>("cluster", clusterId, {
      $set: {
        collectors: newCollectorsArray,
      },
    });

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    const deletionResponse = await client.api(`/users/${collectorId}`).delete();

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(deletionResponse),
    };
  } else {
    context.res = {
      statusCode: 400,
      body: "Missing clusterId or collectorId as query params",
    };
  }
};

type QueryParams = {
  clusterId: string;
  collectorId: string;
};

export default httpTrigger;

