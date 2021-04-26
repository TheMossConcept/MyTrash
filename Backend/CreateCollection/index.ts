import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const requestBody: CollectionRequestCreationDTO = req.body;

  // TODO: Add request body validation here (in the form of a type guard) as well!
  if (requestBody) {
    const { requesterId, clusterId, numberOfUnits } = requestBody;
    const cluster = await databaseAPI.findById<ClusterEntity>(
      "cluster",
      clusterId
    );

    if (cluster) {
      const { logisticsPartnerId, recipientPartnerId } = cluster;

      const insertionReulst = await databaseAPI.insert({
        entityName: "collection",
        logisticsPartnerId,
        recipientPartnerId,
        requesterId,
        numberOfUnits,
      });

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(insertionReulst),
      };
    } else {
      context.res = {
        statusCode: 400,
        body: `Cluster with id ${clusterId} not found`,
      };
    }
  } else {
    context.res = {
      statusCode: 400,
      body: "Bad request: Missing request body",
    };
  }
};

type CollectionRequestCreationDTO = {
  clusterId: string;
  requesterId: string;
  numberOfUnits: number;
};

export default httpTrigger;
