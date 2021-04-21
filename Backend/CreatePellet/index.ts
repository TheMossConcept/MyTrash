import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const requestBody: PelletCreationDTO = req.body;

  // TODO: Add request body validation here (in the form of a type guard) as well!
  if (requestBody) {
    const insertionReulst = await databaseAPI.insert({
      entityName: "pellet",
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
};

type PelletCreationDTO = {
  clusterId: string;
};

export default httpTrigger;

