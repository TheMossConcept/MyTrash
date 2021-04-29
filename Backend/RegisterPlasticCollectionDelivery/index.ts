import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";

type Payload = { collectionId: string };
type Body = { weight: number };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { collectionId } = req.query as Payload;
  const { weight } = req.body as Body;

  const update = await databaseAPI.update<CollectionEntity>(
    "collection",
    collectionId,
    {
      $set: { weight, collectionStatus: "delivered" },
    }
  );

  context.res = {
    body: JSON.stringify(update),
  };
};

export default httpTrigger;
