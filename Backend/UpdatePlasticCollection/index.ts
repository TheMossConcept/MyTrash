import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, {
  CollectionEntity,
  ClusterEntity,
} from "../utils/DatabaseAPI";

// TODO: Make it so that it does not call the database as much!
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const errorMessage = "Der skete en fejl under opdateringen af indsamlingen";

  try {
    const requestBody: CollectionRequestUpdateDTO = req.body;

    // TODO: Add request body validation here (in the form of a type guard) as well!
    if (requestBody) {
      const { collectionId } = req.query as Payload;

      const collection = await databaseAPI.findById<CollectionEntity>(
        "collection",
        collectionId
      );

      // NB! These status codes probably should not be 500!
      if (collection.collectionStatus !== "pending") {
        const body = JSON.stringify({
          rawError: `Trying to update collection with id ${collection._id.toString()} that had the collection status ${
            collection.collectionStatus
          } differents from pending`,
          errorMessage:
            "Du kan ikke rette din afhentning efter den er blevet planlagt",
        });

        context.res = {
          statusCode: 500,
          body,
        };

        return;
      }

      const cluster = await databaseAPI.findById<ClusterEntity>(
        "cluster",
        collection.clusterId
      );

      if (cluster.closedForCollection) {
        const body = JSON.stringify({
          rawError: `You tried to update a collection for the cluster with id ${cluster._id} which is closed for collection`,
          errorMessage: "Du kan ikke rette afhentinger for et lukket cluster",
        });

        context.res = {
          statusCode: 500,
          body,
        };

        return;
      }

      await databaseAPI.updateOne<CollectionEntity>(
        "collection",
        collectionId,
        {
          $set: {
            numberOfUnits: requestBody.numberOfUnits,
            comment: requestBody.comment,
            isLastCollection: requestBody.isLastCollection,
          },
        }
      );

      const updatedEntity = await databaseAPI.findById<CollectionEntity>(
        "collection",
        collectionId
      );

      context.res = {
        body: JSON.stringify(updatedEntity),
      };
    } else {
      const body = JSON.stringify({
        errorMessage,
        rawError: "Bad request: Missing request body",
      });
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

type CollectionRequestUpdateDTO = {
  numberOfUnits?: number;
  isLastCollection?: boolean;
  comment?: string;
};

type Payload = {
  collectionId: string;
};

export default httpTrigger;
