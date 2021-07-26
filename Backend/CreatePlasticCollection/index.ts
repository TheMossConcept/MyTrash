import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, {
  ClusterEntity,
  CollectionEntity,
} from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
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
      context.res = {
        statusCode: 400,
        body: `Cluster with id ${clusterId} not found`,
      };
    }
  } else {
    context.res = {
      statusCode: 400,
      body: "Bad request: Missing request body",
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
