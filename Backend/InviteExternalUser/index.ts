// TODO: Fix the import/no-unresolved error here (and everywhere else)!!
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";
import mongoAPI from "../utils/DatabaseAPI";

// TODO: Get rid of this!
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // TODO: Find a more elegant way to error handling
  try {
    // TODO: Add a guard to ensure that the request is correct. Otherwise, return invalid request
    const requestBody: UserDTO = req.body;
    const { appRoleIds, email, ...additionalUserMetadata } = requestBody;

    // Initialize the client
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers),
    };
    const client = Client.initWithMiddleware(clientOptions);

    // Issue the invitation in accordance with the request
    const invitation = {
      invitedUserEmailAddress: email,
      // TODO: Fix the hardcoding!
      inviteRedirectUrl: "https://gentle-dune-02f023b03.azurestaticapps.net",
      sendInvitationMessage: true,
    };
    const invitationResult = await client.api("/invitations").post(invitation);

    // Get all the information necessary for the appRoleAssignment TODO: Fix the hardcoding of
    // the id and move the roles to the backend registration instead
    const resourceId = "291ca79c-04ea-4531-af1f-9123ff054436";
    const principalId = invitationResult?.invitedUser?.id;

    // TODO: Consider how we can batch these calls! Also, we want to raise and error event if something goes wrong
    // and handle that in an error function!
    appRoleIds.forEach((appRoleId: string) => {
      return client
        .api(`servicePrincipals/${resourceId}/appRoleAssignedTo`)
        .post({ principalId, resourceId, appRoleId });
    });

    // TODO: Here we want to raise an event if something goes wrong as well
    mongoAPI.insert({
      entityName: "userMetadata",
      azureAdId: principalId,
      ...additionalUserMetadata,
    });

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

type UserDTO = {
  email: string;
  companyName: string;
  street: string;
  // NB! Needs to be a string because it can contain letters such as 4A
  streetNumber: string;
  city: string;
  zipCode: number;
  appRoleIds: string[];
};

export default httpTrigger;
