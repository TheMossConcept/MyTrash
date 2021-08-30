import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    context.log("HTTP trigger function processed a request.");
    const requestBody: ProductCreationDTO = req.body;

    // TODO: Add request body validation here (in the form of a type guard) as well!
    if (requestBody) {
      const insertionReulst = await databaseAPI.insert({
        entityName: "product",
        hasBeenSent: false,
        ...requestBody,
      });

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(insertionReulst),
      };
    } else {
      context.res = {
        statusCode: 400,
        body: "Bad request: Missing request body",
      };
    }
  } catch (error) {
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under oprettelsen af varen",
      rawError: error,
    });

    context.res = {
      statusCode: 500,
      body,
    };
  }
};

type ProductCreationDTO = {
  clusterId: string;
  productionPartnerId: string;
  batchId: string;
  productNumber: string;
};

export default httpTrigger;
