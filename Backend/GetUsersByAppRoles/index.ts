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

  // TODO: Add pagination here!
  const users: { value: any[] } = await client
    .api("users?$expand=appRoleAssignments")
    .get();
  const returnValue = users.value.reduce((accumulator, user) => {
    // Get user info to return
    const { id, displayName } = user;

    user.appRoleAssignments.forEach((appRoleAssignment) => {
      const { appRoleId } = appRoleAssignment;

      // For each app role id the user has, add the user's information to the array of users
      // belonging to that key if it exists. If not, create a new array that other users
      // can subsequently be added to
      const existingRoleAssignmentArray = accumulator[appRoleId];
      if (existingRoleAssignmentArray) {
        accumulator[appRoleId] = [
          ...existingRoleAssignmentArray,
          { displayName, id },
        ];
      } else {
        accumulator[appRoleId] = [{ displayName, id }];
      }
    });

    return accumulator;
  }, {});

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(returnValue),
  };
};

export default httpTrigger;

