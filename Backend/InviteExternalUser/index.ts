import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {Client} from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../CustomAuthenticationProvider";

type RequestBody = {
  email: string;
  redirectUrl: string;
  appRoleId: string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // TODO: Find a more elegant way to error handling
  try {
    // TODO: Add a guard to ensure that the request is correct. Otherwise, return invalid request
    const requestBody: RequestBody = req.body;

    // Initialize the client
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers)
    }
    const client = Client.initWithMiddleware(clientOptions)

    // Issue the invitation in accordance with the request
    const invitation = {
      invitedUserEmailAddress: requestBody.email,
      inviteRedirectUrl: requestBody.redirectUrl,
      sendInvitationMessage: true
    };
    const invitationResult = await client.api('/invitations')
      .post(invitation);

    // Get the service principal for which we want to add a role. TODO: Fix the hardcoding of 
    // the id and move the roles to the backend registration instead
    const servicePrincipalId = '291ca79c-04ea-4531-af1f-9123ff054436';
    // const servicePrincipal = await client.api(`servicePrincipals/${servicePrincipalId}`).get()

    const invitedUserId = invitationResult?.invitedUser?.id;

   // await client.api(`users/${invitedUserId}/appRoleAssignments`).post({ principalId: invitedUserId, resourceId: servicePrincipalId, appRoleId: requestBody.appRoleId })

    // TODO: Here, do an app role assignment in accordance with
    // the role passed in the request payload as outlined by 
    // https://docs.microsoft.com/en-us/graph/api/resources/approleassignment?view=graph-rest-1.0

    context.res = {
      body: JSON.stringify(invitationResult)
    }
  } catch (error) {
    context.res = {
      body: `${JSON.stringify(error)}`,
      statusCode: '500'
    }
  }
};

export default httpTrigger;
