import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, {
  ClusterEntity,
  CollectionEntity,
} from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const requestBody: CollectionRequestCreationDTO = req.body;

    // TODO: Add request body validation here (in the form of a type guard) as well!
    if (requestBody) {
      const {
        requesterId,
        clusterId,
        numberOfUnits,
        comment,
        isLastCollection,
      } = requestBody;
      const cluster = await databaseAPI.findById<ClusterEntity>(
        "cluster",
        clusterId
      );

      if (cluster) {
        if (cluster.closedForCollection) {
          const body = JSON.stringify({
            rawError: `You tried to create a collection for the cluster with id ${cluster._id} which is closed for collection`,
            errorMessage:
              "Du kan ikke oprette afhentinger for et lukket cluster",
          });

          context.res = {
            statusCode: 500,
            body,
          };
        }
        const { logisticsPartnerId, recipientPartnerId } = cluster;

        const previousCollection = await databaseAPI.findOne<CollectionEntity>(
          "collection",
          { clusterId, requesterId }
        );
        // If there is just ONE previous collection to be found, we know this is not
        // the first one we order and therefor we do not need to query them all, just
        // one is sufficient
        const isFirstCollection = !previousCollection;

        const insertionReulst = await databaseAPI.insert({
          entityName: "collection",
          createdAt: new Date(),
          isFirstCollection,
          isLastCollection,
          clusterId,
          logisticsPartnerId,
          recipientPartnerId,
          requesterId,
          numberOfUnits,
          collectionStatus: "pending",
          comment,
        });

        context.res = {
          body: JSON.stringify(insertionReulst),
        };
      } else {
        const body = JSON.stringify({
          rawError: `Cluster with id ${clusterId} not found`,
          errorMessage: "Der skete en fejl under oprettelsen af indsamlingen.",
        });
        context.res = {
          statusCode: 400,
          body,
        };
      }
    } else {
      const body = JSON.stringify({
        rawError: "Bad request: Missing request body",
        errorMessage: "Der skete en fejl under oprettelsen af indsamlingen.",
      });
      context.res = {
        statusCode: 400,
        body,
      };
    }
  } catch (error) {
    const body = JSON.stringify({
      rawError: error,
      errorMessage: "Der skete en fejl under oprettelsen af indsamlingen.",
    });
    context.res = {
      statusCode: 500,
      body,
    };
  }
};

type CollectionRequestCreationDTO = {
  clusterId: string;
  requesterId: string;
  numberOfUnits: number;
  isLastCollection: boolean;
  comment: string;
};

export default httpTrigger;
