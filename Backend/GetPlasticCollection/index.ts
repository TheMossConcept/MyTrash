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
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under hentningen af indsamlingen",
      rawError: error,
    });

    context.res = {
      body,
      statusCode: 500,
    };
  }
};

type Payload = {
  id: string;
};

export default httpTrigger;
