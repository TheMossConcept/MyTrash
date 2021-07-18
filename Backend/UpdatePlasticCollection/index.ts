import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { CollectionEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const requestBody: CollectionRequestUpdateDTO = req.body;

    // TODO: Add request body validation here (in the form of a type guard) as well!
    if (requestBody) {
      const { collectionId } = req.query as Payload;

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

      const resultingEntity = await databaseAPI.findById<CollectionEntity>(
        "collection",
        collectionId
      );

      context.res = {
        body: JSON.stringify(resultingEntity),
      };
    } else {
      context.res = {
        statusCode: 400,
        body: "Bad request: Missing request body",
      };
    }
  } catch (error) {
    context.res = {
      statusCode: 500,
      body: JSON.stringify(error),
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
