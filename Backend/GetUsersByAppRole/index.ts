import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";
import { UserRole } from "../utils/DatabaseAPI";

// TODO: We need to rewrite this!
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    const { appRole } = req.query as QueryParams;

    // Please note that t his is the client id of the b2c-extensions-app and NOT of the actual app registration itself!
    // Also note that the -'s have been removed
    const clientId = process.env.ClientId;

    const usersResult = await client
      .api(`/users?$filter=extension_${clientId}_${appRole} eq true`)
      .get();

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(usersResult.value),
    };
  } catch (e) {
    context.res = {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};

type QueryParams = { appRole: UserRole };

export default httpTrigger;
