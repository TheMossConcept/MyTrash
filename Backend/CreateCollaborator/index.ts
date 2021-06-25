// NB! This import needs to be here somewhere for the Microsoft Graph API for work properly
import "isomorphic-fetch";

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import { UserRole, allUserRoles } from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const requestBody: CollaboratorDTO = req.body;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyName,
      street,
      streetNumber,
      city,
      zipCode,
      role,
    } = requestBody;

    // Fail fast
    // TODO: Consider adding yup validation instead!!
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !companyName ||
      !street ||
      !streetNumber ||
      !city ||
      !zipCode ||
      !role ||
      !allUserRoles.includes(role)
    ) {
      context.res = {
        body:
          "Bad request. Required property is missing of the role used is incorrect",
      };
    }

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // Please note that t his is the client id of the b2c-extensions-app and NOT of the actual app registration itself!
    // Also note that the -'s have been removed
    const clientId = process.env.ClientId;
    // This is linked to the Azure AD instance
    const issuer = process.env.ADIssuer;

    const extensionsObject = allUserRoles.reduce(
      (accumulator, currentValue) => {
        const newValue = {
          [`extension_${clientId}_${currentValue}`]: role === currentValue,
        };
        return { ...accumulator, ...newValue };
      },
      {}
    );

    const createdUser = await client.api("/users").post({
      // NB! Down until given name will no longer be needed when creating in B2C
      identities: [
        {
          signInType: "emailAddress",
          issuer,
          issuerAssignedId: email,
        },
      ],
      // Display a collaborator by using its company!
      displayName: companyName,
      givenName: firstName,
      surname: lastName,
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
      ...extensionsObject,
    });

    context.res = {
      body: JSON.stringify(createdUser),
    };
  } catch (e) {
    context.res = {
      body: e.message,
      statusCode: 500,
    };
  }
};

type CollaboratorDTO = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  // NB! Needs to be a string because it can contain letters such as 4A
  streetNumber: string;
  city: string;
  zipCode: number;
  phoneNumber: string;
  companyName: string;
  role: UserRole;
};

export default httpTrigger;
