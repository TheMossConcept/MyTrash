import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { id } = req.query as Payload;

    const plasticCollection = await databaseAPI.findById<CollectionEntity>(
      "collection",
      id
    );

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(plasticCollection),
    };
  } catch (error) {
    context.res = {
      body: JSON.stringify(error),
      statusCode: 500,
    };
  }
};

type Payload = {
  id: string;
};

export default httpTrigger;

