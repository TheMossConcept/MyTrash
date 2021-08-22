import { AzureFunction, HttpRequest, Context } from "@azure/functions";
import databaseAPI, { BatchEntity } from "../utils/DatabaseAPI";

type Payload = { batchId: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { batchId } = req.query as Payload;

    const update = await databaseAPI.updateOne<BatchEntity>("batch", batchId, {
      $set: { batchStatus: "received", receivedDate: new Date() },
    });

    context.res = {
      body: JSON.stringify(update),
    };
  } catch (error) {
    const body = JSON.stringify({
      errorMessage:
        "Der skete en fejl under registreringen af batch modtagelse",
      rawError: error,
    });

    context.res = {
      body,
      statusCode: 500,
    };
  }
};

export default httpTrigger;
