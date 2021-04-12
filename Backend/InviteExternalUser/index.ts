import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {Client} from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../CustomAuthenticationProvider";

type RequestBody = {
  email: string;
  redirectUrl: string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // TODO: Find a more elegant way to error handling
  try {
    const requestBody: RequestBody = req.body;
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers)
    }
    const client = Client.initWithMiddleware(clientOptions)
    const invitation = {
      invitedUserEmailAddress: requestBody.email,
      inviteRedirectUrl: requestBody.redirectUrl,
      sendInvitationMessage: true
    };

    const invitedUser = await client.api('/invitations')
      .post(invitation);

    // TODO: Here, do an app role assignment in accordance with
    // the role passed in the request payload as outlined by 
    // https://docs.microsoft.com/en-us/graph/api/resources/approleassignment?view=graph-rest-1.0

    context.res = {
      body: JSON.stringify(invitedUser)
    }
  } catch (error) {
    context.res = {
      body: `${JSON.stringify(error)}`,
      statusCode: '500'
    }
  }
};

export default httpTrigger;
