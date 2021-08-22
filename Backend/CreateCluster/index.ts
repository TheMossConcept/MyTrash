import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    context.log("HTTP trigger function processed a request.");
    const requestBody: ClusterCreationDTO = req.body;

    const { isOpen, necessaryPlastic, ...clusterPayload } = requestBody;

    // TODO: Add request body validation here (in the form of a type guard) as well!
    if (requestBody) {
      const insertionReulst = await databaseAPI.insert({
        entityName: "cluster",
        open: isOpen,
        closedForCollection: false,
        necessaryAmountOfPlastic: necessaryPlastic,
        collectors: [],
        ...clusterPayload,
      });

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: JSON.stringify(insertionReulst),
      };
    } else {
      const body = JSON.stringify({
        rawError: "Bad request: Missing request body",
        errorMessage: "Der skete en fejl, da du forsøgte at oprette clusteret",
      });
      context.res = {
        statusCode: 400,
        body,
      };
    }
  } catch (error) {
    const body = JSON.stringify({
      rawError: error,
      errorMessage: "Der skete en fejl, da du forsøgte at oprette clusteret",
    });
    context.res = {
      statusCode: 500,
      body,
    };
  }
};

type ClusterCreationDTO = {
  collectionAdministratorId: string;
  recipientPartnerId: string;
  logisticsPartnerId: string;
  productionPartnerId: string;
  isOpen: boolean;
  c5Reference: string;
  usefulPlasticFactor: number;
  necessaryPlastic: number;
  name: string;
};

export default httpTrigger;
