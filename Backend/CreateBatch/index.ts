import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const requestBody: BatchCreationDTO = req.body;

  // TODO: Add request body validation here (in the form of a type guard) as well!
  if (requestBody) {
    const { clusterId } = requestBody;
    const cluster = await databaseAPI.findById<ClusterEntity>(
      "cluster",
      clusterId
    );

    if (cluster) {
      const { recipientPartnerId, productionPartnerId } = cluster;
      const insertionReulst = await databaseAPI.insert({
        entityName: "batch",
        batchStatus: "created",
        recipientPartnerId,
        productionPartnerId,
        createdAt: new Date(),
        ...requestBody,
      });

      context.res = {
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

type BatchCreationDTO = {
  clusterId: string;
  batchNumber: string;
  inputWeight: number;
  outputWeight: number;
  addtionFactor: number;
};

export default httpTrigger;
