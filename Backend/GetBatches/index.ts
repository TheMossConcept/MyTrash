import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import databaseAPI, { BatchEntity } from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

type BatchFromDb = BatchEntity & { _id: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const customAuthProvider = new CustomAuthenticationProvider();
  const client = Client.initWithMiddleware({
    authProvider: customAuthProvider,
  });

  // TODO: Change clusterId to recipientPartnerId as we want all batches for a given recipient
  const {
    recipientPartnerId,
    productionPartnerId,
    sortBy,
  } = req.query as Payload;

  const queryIsLimitedToUser = recipientPartnerId || productionPartnerId;
  // TODO: This type should automatically be inferred!
  const batchesForRecipient: BatchFromDb[] = await databaseAPI.find<BatchFromDb>(
    "batch",
    queryIsLimitedToUser
      ? {
          $or: [
            { recipientPartnerId: { $exists: true, $eq: recipientPartnerId } },
            {
              productionPartnerId: { $exists: true, $eq: productionPartnerId },
            },
          ],
        }
      : undefined,
    sortBy ? { [sortBy]: -1 } : undefined
  );

  const returnValuePromises = batchesForRecipient.map(async (batch) => {
    // NB! The recipient partner is always the creator
    const creator = await client
      .api(`users/${batch.recipientPartnerId}?$select=companyName,displayName`)
      .get();

    const productionPartner = await client
      .api(`users/${batch.productionPartnerId}?$select=companyName,displayName`)
      .get();

    // The company name should always be there, but fall back to display name just in case
    const creatorName = creator?.companyName || creator?.displayName;
    const recipientName =
      productionPartner?.companyName || productionPartner?.displayName;

    const { _id, ...batchToReturn } = batch;

    // TODO: Consider whether we should throw an exception here or just return collection
    if (creatorName && recipientName) {
      return {
        id: _id,
        creatorName,
        recipientName,
        ...batchToReturn,
      };
    }
    throw new Error(
      `Batch creator or recipient could not be found for recipientPartnerId ${batch.recipientPartnerId} or productionPartnerId ${batch.productionPartnerId} or their company name was not set`
    );
  });

  const returnValue = await Promise.all(returnValuePromises);

  context.res = {
    body: JSON.stringify(returnValue),
  };
};

type Payload = {
  recipientPartnerId: string;
  productionPartnerId: string;
  sortBy: string;
};

export default httpTrigger;
