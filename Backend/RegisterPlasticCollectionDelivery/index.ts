import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";

type Payload = { collectionId: string };
type Body = { weight?: number };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // We cannot destruct as the request body might be undefined
    const body = req.body as Body;
    const weight = body?.weight;

    const { collectionId } = req.query as Payload;

    const update = await databaseAPI.updateOne<CollectionEntity>(
      "collection",
      collectionId,
      {
        $set: {
          weight,
          collectionStatus: "delivered",
          deliveryDate: new Date(),
        },
      }
    );

    context.res = {
      body: JSON.stringify(update),
    };
  } catch (error) {
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under registrering af afleveringen",
      rawError: error,
    });

    context.res = {
      body,
      statusCode: 500,
    };
  }
};

export default httpTrigger;
