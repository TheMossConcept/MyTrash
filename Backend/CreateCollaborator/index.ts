import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import { UserRole } from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const requestBody: CollaboratorDTO = req.body;
    const {
      contactPersoName,
      contactPersonEmail,
      companyName,
      street,
      streetNumber,
      city,
      zipCode,
      role,
    } = requestBody;

    // Initialize the client
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers),
    };
    const client = Client.initWithMiddleware(clientOptions);

    // TODO: Fix hardcoding
    const clientId = "93d698bf-5f62-4b7d-9a5b-cf9fa4dd0412";

    const isAdministrator = role === "administrator";
    const isCollectionAdministrator = role === "collectionAdministrator";
    const isLogisticsPartner = role === "logisticsPartner";
    const isRecipientPartner = role === "recipientPartner";
    const isProductionPartner = role === "productionPartner";

    const createdCollaborator = await client.api("/users").post({
      givenName: contactPersoName,
      streetAddress: `${street} ${streetNumber.toString}`,
      city,
      postalCode: zipCode.toString(),
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: "Test1234!",
      },
      identities: [
        {
          signInType: "emailAddress",
          // TODO: Fix hardcoding
          issuer: "mossconsultingorg.onmicrosoft.com",
          issuerAssignedId: contactPersonEmail,
        },
      ],
      companyName,
      [`extension_${clientId}_isAdministrator`]: isAdministrator,
      [`extension_${clientId}_isCollectionAdministrator`]: isCollectionAdministrator,
      [`extension_${clientId}_isLogisticsPartner`]: isLogisticsPartner,
      [`extension_${clientId}_isRecipientPartner`]: isRecipientPartner,
      [`extension_${clientId}_isProductionPartner`]: isProductionPartner,
    });

    context.res = {
      body: JSON.stringify(createdCollaborator),
    };
  } catch (e) {
    context.res = {
      body: JSON.stringify(e),
      statusCode: 500,
    };
  }
};

type CollaboratorDTO = {
  contactPersoName: string;
  contactPersonEmail: string;
  companyName: string;
  street: string;
  // NB! Needs to be a string because it can contain letters such as 4A
  streetNumber: number;
  city: string;
  zipCode: number;
  role: UserRole;
};

export default httpTrigger;

