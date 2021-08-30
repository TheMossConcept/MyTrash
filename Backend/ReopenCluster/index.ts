import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { clusterId } = req.query as Payload;
    const updateResult = await databaseAPI.updateOne<ClusterEntity>(
      "cluster",
      clusterId,
      {
        // Just update everything we get. If it hasn't been changed, it'll be the same as before
        $set: {
          closedForCollection: false,
          dateClosed: undefined,
        },
      }
    );

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(updateResult),
    };
  } catch (error) {
    const body = JSON.stringify({
      rawError: error,
      errorMessage: "Der skete en fejl, da du forsøgte at genåbne clusteret.",
    });
    context.res = {
      statusCode: 500,
      body,
    };
  }
};

type Payload = { clusterId: string };

export default httpTrigger;
