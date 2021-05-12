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

    // TODO: Fix hardcoding!
    const clientId = "efe81d2e0be34a3e87eb2cffd57626ce";

    const users = await client
      .api(`/users?$filter=extension_${clientId}_${appRole} eq true`)
      .get();

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(users),
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
