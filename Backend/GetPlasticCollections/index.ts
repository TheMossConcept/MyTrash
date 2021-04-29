import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, {
  CollectionEntity,
  UserMetadataEntity,
} from "../utils/DatabaseAPI";

type CollectionFromDb = CollectionEntity & { _id: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { logisticsPartnerId, collectorId, clusterId } = req.query as Payload;

  // TODO: This type should automatically be inferred!
  const collectionsForPartner: CollectionFromDb[] = await databaseAPI.find<CollectionFromDb>(
    "collection",
    {
      $and: [
        clusterId ? { clusterId: { $exists: true, $eq: clusterId } } : {},
        {
          $or: [
            { logisticsPartnerId: { $exists: true, $eq: logisticsPartnerId } },
            { requesterId: { $exists: true, $eq: collectorId } },
          ],
        },
      ],
    }
  );

  const returnValuePromises = collectionsForPartner.map(async (collection) => {
    // TODO: Consider how we can do this without querying the database so much
    const requester = await databaseAPI.findOne<UserMetadataEntity>(
      "userMetadata",
      { azureAdId: collection.requesterId }
    );

    const { _id, ...collectionToReturn } = collection;

    // TODO: Consider whether we should throw an exception here or just return collection
    if (requester) {
      return {
        ...collectionToReturn,
        id: _id,
        streetName: requester.street,
        streetNumber: requester.streetNumber,
        city: requester.city,
        zipCode: requester.zipCode,
        companyName: requester.companyName,
      };
    }
    return { id: _id, ...collectionToReturn };
  });

  const returnValue = await Promise.all(returnValuePromises);

  context.res = {
    body: JSON.stringify(returnValue),
  };
};

type Payload = {
  logisticsPartnerId: string;
  collectorId: string;
  clusterId: string;
};

export default httpTrigger;
