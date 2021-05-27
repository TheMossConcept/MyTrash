import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const { clusterId } = req.query as Payload;
  const requestBody: ClusterCreationDTO = req.body;

  const { isOpen, necessaryPlastic, ...clusterPayload } = requestBody;

  // TODO: Add request body validation here (in the form of a type guard) as well!
  if (requestBody) {
    const insertionReulst = await databaseAPI.updateOne<ClusterEntity>(
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
      body: JSON.stringify(insertionReulst),
    };
  } else {
    context.res = {
      statusCode: 400,
      body: "Bad request: Missing request body",
    };
  }
};

type Payload = { clusterId: string };

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
