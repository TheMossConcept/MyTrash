import "isomorphic-fetch";

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";
import { AppRole } from "../types";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // TODO: Fix the hardcoding!
  const resourceId = "291ca79c-04ea-4531-af1f-9123ff054436";

  try {
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers),
    };
    const client = Client.initWithMiddleware(clientOptions);
    const servicePrincipal = await client
      .api(`/servicePrincipals/${resourceId}`)
      .get();

    const servicePrincipalAppRoles: AppRole[] = servicePrincipal.appRoles || [];
    const servicePrincipalUserAppRoles = servicePrincipalAppRoles.filter(
      (servicePrincipalAppRole: AppRole) =>
        servicePrincipalAppRole.allowedMemberTypes.includes("User")
    );

    // Remove everything not relevant to the frontend
    const returnValue = servicePrincipalUserAppRoles.map(
      (servicePrincipalUserAppRole) => ({
        description: servicePrincipalUserAppRole.description,
        id: servicePrincipalUserAppRole.id,
        displayName: servicePrincipalUserAppRole.displayName,
        value: servicePrincipalUserAppRole.value,
      })
    );

    context.res = {
      body: JSON.stringify(returnValue),
    };
  } catch (error) {
    context.res = {
      body: `${JSON.stringify(error)}`,
      statusCode: "500",
    };
  }
};

export default httpTrigger;
