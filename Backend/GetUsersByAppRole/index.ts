import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // Initialize the client
  const clientOptions = {
    authProvider: new CustomAuthenticationProvider(req.headers),
  };
  const client = Client.initWithMiddleware(clientOptions);

  const appRoleToInclude: string = req.query.appRoleId;
  // TODO: Add pagination here!
  const users: { value: any[] } = await client
    .api("users?$expand=appRoleAssignments")
    .get();
  const returnValue = users.value.reduce((accumulator, user) => {
    // Get user info to return
    const { id, displayName } = user;

    const appRoleAssignmentIdsForUser = user.appRoleAssignments.map(
      (appRoleAssignment: { appRoleId: string }) => appRoleAssignment.appRoleId
    );
    if (appRoleAssignmentIdsForUser.includes(appRoleToInclude)) {
      return [...accumulator, { displayName, id }];
    }
    return accumulator;
  }, []);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(returnValue),
  };
};

export default httpTrigger;
