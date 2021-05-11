import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

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

    const user = await client
      .api(
        encodeURI(
          `/users/${userId}?$select=extension_${clientId}_isAdministrator,extension_${clientId}_isCollectionAdministrator,extension_${clientId}_isLogisticsPartner,extension_${clientId}_isRecipientPartner,extension_${clientId}_isProductionPartner`
        )
      )
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

