import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { collectorId } = req.query;
    const { newCollectionRequirement } = req.body;

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // TODO: Fix hardcoding. Please note that t his is the client id of the b2c-extensions-app
    // and NOT of the actual app registration itself! Also note that the -'s have been removed
    const clientId = "efe81d2e0be34a3e87eb2cffd57626ce";

    await client.api(`/users/${collectorId}`).patch({
      [`extension_${clientId}_CollectionRequirement`]: newCollectionRequirement,
    });

    context.res = {
      statusCode: 200,
    };
  } catch (error) {
    context.res = {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export default httpTrigger;

