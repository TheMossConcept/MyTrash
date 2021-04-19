import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

type RequestBody = {
  email: string;
  appRoleIds: string[];
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // TODO: Find a more elegant way to error handling
  try {
    // TODO: Add a guard to ensure that the request is correct. Otherwise, return invalid request
    const requestBody: RequestBody = req.body;

    // Initialize the client
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers),
    };
    const client = Client.initWithMiddleware(clientOptions);

    // Issue the invitation in accordance with the request
    const invitation = {
      invitedUserEmailAddress: requestBody.email,
      // TODO: Fix the hardcoding!
      inviteRedirectUrl: "https://gentle-dune-02f023b03.azurestaticapps.net",
      sendInvitationMessage: true,
    };
    const invitationResult = await client.api("/invitations").post(invitation);

    // Get all the information necessary for the appRoleAssignment TODO: Fix the hardcoding of
    // the id and move the roles to the backend registration instead
    const resourceId = "291ca79c-04ea-4531-af1f-9123ff054436";
    const principalId = invitationResult?.invitedUser?.id;
    const { appRoleIds } = requestBody;

    // TODO: Consider how we can batch these calls!
    appRoleIds.forEach((appRoleId: string) => {
      return client
        .api(`servicePrincipals/${resourceId}/appRoleAssignedTo`)
        .post({ principalId, resourceId, appRoleId });
    });

    // TODO: Here, do an app role assignment in accordance with
    // the role passed in the request payload as outlined by
    // https://docs.microsoft.com/en-us/graph/api/resources/approleassignment?view=graph-rest-1.0

    context.res = {
      body: JSON.stringify(invitationResult),
    };
  } catch (error) {
    context.res = {
      body: `${JSON.stringify(error)}`,
      statusCode: "500",
    };
  }
};

export default httpTrigger;
