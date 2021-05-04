import { AzureFunction, HttpRequest, Context } from "@azure/functions";
import databaseAPI, { BatchEntity } from "../utils/DatabaseAPI";

type Payload = { batchId: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { batchId } = req.query as Payload;

  const update = await databaseAPI.updateOne<BatchEntity>("batch", batchId, {
    $set: { batchStatus: "received" },
  });

  context.res = {
    body: JSON.stringify(update),
  };
};

export default httpTrigger;
