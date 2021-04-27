import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, {
  CollectionEntity,
  UserMetadataEntity,
} from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { logisticsPartnerId } = req.query as Payload;

  // TODO: This type should automatically be inferred!
  const collectionsForPartner: CollectionEntity[] = await databaseAPI.find<CollectionEntity>(
    "collection",
    { logisticsPartnerId: { $exists: true, $eq: logisticsPartnerId } }
  );

  const returnValuePromises = collectionsForPartner.map(async (collection) => {
    // TODO: Consider how we can do this without querying the database so much
    const requester = await databaseAPI.findOne<UserMetadataEntity>(
      "userMetadata",
      { azureAdId: collection.requesterId }
    );

    // TODO: Consider whether we should throw an exception here or just return collection
    if (requester) {
      return {
        ...collection,
        streetName: requester.street,
        city: requester.city,
        zipCode: requester.zipCode,
        companyName: requester.companyName,
      };
    }
    return collection;
  });

  const returnValue = await Promise.all(returnValuePromises);

  context.res = {
    body: JSON.stringify(returnValue),
  };
};

type Payload = {
  logisticsPartnerId: string;
};

export default httpTrigger;

