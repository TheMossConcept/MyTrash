import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";

type QueryParams = {
  collectionId: string;
};

type RequestBody = {
  pickupDate: string;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { collectionId } = req.query as QueryParams;
  const { pickupDate } = req.body as RequestBody;

  const statusUpdate = await databaseAPI.updateOne<CollectionEntity>(
    "collection",
    collectionId,
    {
      $set: {
        scheduledPickupDate: new Date(pickupDate),
        collectionStatus: "scheduled",
      },
    }
  );

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(statusUpdate),
  };
};

export default httpTrigger;
