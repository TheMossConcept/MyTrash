import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const requestBody: JoinClusterDTO = req.body;
  const { collectorId, clusterId } = requestBody;

  const updateResult = await databaseAPI.updateOne<ClusterEntity>(
    "cluster",
    clusterId,
    {
      $addToSet: { collectors: collectorId },
    }
  );

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(updateResult),
  };
};

type JoinClusterDTO = {
  collectorId: string;
  clusterId: string;
};

export default httpTrigger;
