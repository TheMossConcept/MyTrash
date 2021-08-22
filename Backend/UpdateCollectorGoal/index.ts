import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { collectorId } = req.query;
    const { collectionGoal } = req.body;

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // Please note that t his is the client id of the b2c-extensions-app and NOT of the actual app registration itself!
    // Also note that the -'s have been removed
    const clientId = process.env.ClientId;

    await client.api(`/users/${collectorId}`).patch({
      [`extension_${clientId}_CollectionGoal`]: collectionGoal,
    });

    context.res = {
      statusCode: 200,
    };
  } catch (error) {
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under opdateringen af indsamlerens mål",
      rawError: error,
    });

    context.res = {
      statusCode: 500,
      body,
    };
  }
};

export default httpTrigger;
