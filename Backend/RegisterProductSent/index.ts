import { AzureFunction, HttpRequest, Context } from "@azure/functions";
import databaseAPI, { ProductEntity } from "../utils/DatabaseAPI";

type Payload = { productId: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const { productId } = req.query as Payload;

  const update = await databaseAPI.update<ProductEntity>("product", productId, {
    $set: { hasBeenSent: true },
  });

  context.res = {
    body: JSON.stringify(update),
  };
};

export default httpTrigger;
