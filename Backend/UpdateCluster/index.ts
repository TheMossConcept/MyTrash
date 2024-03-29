import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const errorMessage = "Der skete en fejl under opdateringen af clusteret";

  try {
    const { clusterId } = req.query as Payload;
    const requestBody: ClusterUpdateDTO = req.body;

    const { isOpen, necessaryPlastic, ...clusterPayload } = requestBody;

    // TODO: Add request body validation here (in the form of a type guard) as well!
    if (requestBody) {
      const updateResult = await databaseAPI.updateOne<ClusterEntity>(
        "cluster",
        clusterId,
        {
          // Just update everything we get. If it hasn't been changed, it'll be the same as before
          $set: {
            open: isOpen,
            necessaryAmountOfPlastic: necessaryPlastic,
            collectors: [],
            ...clusterPayload,
          },
        }
      );

      context.res = {
        body: JSON.stringify(updateResult),
      };
    } else {
      const body = {
        errorMessage,
        rawError: "Bad request: Missing request body",
      };
      context.res = {
        statusCode: 400,
        body,
      };
    }
  } catch (error) {
    const body = JSON.stringify({
      errorMessage,
      rawError: error,
    });

    context.res = {
      statusCode: 500,
      body,
    };
  }
};

type Payload = { clusterId: string };

type ClusterUpdateDTO = {
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
