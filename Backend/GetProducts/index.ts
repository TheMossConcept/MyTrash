import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ProductEntity } from "../utils/DatabaseAPI";

type ProductFromDb = ProductEntity & { _id: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // TODO: Change clusterId to recipientPartnerId as we want all batches for a given recipient
  const { batchId } = req.query as Payload;

  // TODO: This type should automatically be inferred!
  const productsInBatch: ProductFromDb[] = await databaseAPI.find<ProductFromDb>(
    "product",
    batchId ? { batchId: { $exists: true, $eq: batchId } } : {}
  );

  const productsToReturn = productsInBatch.map((productInBatch) => {
    const { _id, ...productData } = productInBatch;
    return { id: _id, ...productData };
  });

  context.res = {
    body: JSON.stringify(productsToReturn),
  };
};

type Payload = {
  batchId: string;
};

export default httpTrigger;
