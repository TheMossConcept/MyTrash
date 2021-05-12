import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";
import { allUserRoles } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { userId } = req.query as Payload;

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // TODO: Fix hardcoding!
    const clientId = "efe81d2e0be34a3e87eb2cffd57626ce";

    const extensionSelectionStrings = allUserRoles.map((userRole) => {
      return `extension_${clientId}_${userRole}`;
    });
    const extensionSelectionString = extensionSelectionStrings.join(",");

    const user = await client
      .api(`/users/${userId}?$select=${extensionSelectionString}`)
      .get();

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(user),
    };
  } catch (e) {
    context.res = {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};

type Payload = { userId: string };

export default httpTrigger;

