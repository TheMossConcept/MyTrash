import { AzureFunction, HttpRequest, Context } from "@azure/functions";
import databaseAPI, { ProductEntity } from "../utils/DatabaseAPI";

type Payload = { productId: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { productId } = req.query as Payload;

    const update = await databaseAPI.updateOne<ProductEntity>(
      "product",
      productId,
      {
        $set: { hasBeenSent: true },
      }
    );

    context.res = {
      body: JSON.stringify(update),
    };
  } catch (error) {
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under registreringen af afsendelsen",
      rawError: error,
    });

    context.res = {
      body,
      statusCode: 500,
    };
  }
};

export default httpTrigger;
