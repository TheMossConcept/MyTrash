import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

type CollectionFromDb = CollectionEntity & { _id: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const customAuthProvider = new CustomAuthenticationProvider();
  const client = Client.initWithMiddleware({
    authProvider: customAuthProvider,
  });

  const {
    logisticsPartnerId,
    recipientPartnerId,
    collectorId,
    clusterId,
    sortBy,
  } = req.query as Payload;

  // TODO: This type should automatically be inferred!
  const collectionsForPartner: CollectionFromDb[] = await databaseAPI.find<CollectionFromDb>(
    "collection",
    {
      $and: [
        clusterId ? { clusterId: { $exists: true, $eq: clusterId } } : {},
        {
          $or: [
            { logisticsPartnerId: { $exists: true, $eq: logisticsPartnerId } },
            { recipientPartnerId: { $exists: true, $eq: recipientPartnerId } },
            { requesterId: { $exists: true, $eq: collectorId } },
          ],
        },
      ],
    },
    sortBy
      ? {
          [sortBy]: -1,
        }
      : undefined
  );

  const returnValuePromises = collectionsForPartner.map(async (collection) => {
    // TODO: Consider how we can do this without querying the database so much
    const requester = await client
      .api(
        `users/${collection.requesterId}?$select=streetAddress,city,postalCode,companyName`
      )
      .get();

    const { _id, ...collectionToReturn } = collection;

    // TODO: Consider whether we should throw an exception here or just return collection
    if (requester) {
      return {
        ...collectionToReturn,
        id: _id,
        streetAddress: requester.streetAddress,
        city: requester.city,
        zipCode: requester.postalCode,
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
  recipientPartnerId: string;
  collectorId: string;
  clusterId: string;
  sortBy: string;
};

export default httpTrigger;
