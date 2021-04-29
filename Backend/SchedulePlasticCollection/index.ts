import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";

type QueryParams = {
  collectionId: string;
};

type RequestBody = {
  pickupDate: Date;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { collectionId } = req.query as QueryParams;
  const { pickupDate } = req.rawBody as RequestBody;

  const statusUpdate = databaseAPI.update<CollectionEntity>(
    "collection",
    collectionId,
    {
      $set: { scheduledPickupDate: pickupDate, collectionStatus: "scheduled" },
    }
  );

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: statusUpdate,
  };
};

export default httpTrigger;

