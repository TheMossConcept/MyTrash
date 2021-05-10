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
      contactPersonName,
      contactPersonEmail,
      phoneNumber,
      companyName,
      street,
      streetNumber,
      city,
      zipCode,
      role,
    } = requestBody;

    // Initialize the client
    /*
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers),
    };
    */
    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // TODO: Fix hardcoding. Please note that t his is the client id of the b2c-extensions-app
    // and NOT of the actual app registration itself! Also note that the -'s have been removed
    const clientId = "efe81d2e0be34a3e87eb2cffd57626ce";

    const isAdministrator = role === "administrator";
    const isCollectionAdministrator = role === "collectionAdministrator";
    const isLogisticsPartner = role === "logisticsPartner";
    const isRecipientPartner = role === "recipientPartner";
    const isProductionPartner = role === "productionPartner";

    const createdCollaborator = await client.api("/users").post({
      // NB! Down until given name will no longer be needed when creating in B2C
      identities: [
        {
          signInType: "emailAddress",
          // TODO: Fix hardcoding
          issuer: "mossconsultingorg.onmicrosoft.com",
          issuerAssignedId: contactPersonEmail,
        },
      ],
      displayName: contactPersonName,
      givenName: contactPersonName,
      streetAddress: `${street} ${streetNumber.toString()}`,
      city,
      mobilePhone: phoneNumber,
      postalCode: zipCode.toString(),
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: "Test1234!",
      },
      // passwordPolicies: "DisablePasswordExpiration",
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
  contactPersonName: string;
  contactPersonEmail: string;
  companyName: string;
  street: string;
  // NB! Needs to be a string because it can contain letters such as 4A
  streetNumber: number;
  city: string;
  zipCode: number;
  phoneNumber: string;
  role: UserRole;
};

export default httpTrigger;
