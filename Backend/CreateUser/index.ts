import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import databaseAPI, {
  UserRole,
  ClusterEntity,
  allUserRoles,
} from "../utils/DatabaseAPI";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const requestBody: UserDTO = req.body;
    const {
      firstName,
      lastName,
      clusterId,
      email,
      phoneNumber,
      companyName,
      street,
      streetNumber,
      city,
      zipCode,
      role,
    } = requestBody;

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // TODO: Fix hardcoding. Please note that t his is the client id of the b2c-extensions-app
    // and NOT of the actual app registration itself! Also note that the -'s have been removed
    const clientId = "efe81d2e0be34a3e87eb2cffd57626ce";

    const extensionsObject = allUserRoles.reduce(
      (accumulator, currentValue) => {
        const newValue = {
          [`extension_${clientId}_${currentValue}`]: role === currentValue,
        };
        return { ...accumulator, ...newValue };
      },
      {}
    );

    const createdCollaborator = await client.api("/users").post({
      // NB! Down until given name will no longer be needed when creating in B2C
      identities: [
        {
          signInType: "emailAddress",
          // TODO: Fix hardcoding
          issuer: "mossconsultingorg.onmicrosoft.com",
          issuerAssignedId: email,
        },
      ],
      displayName: `${firstName} ${lastName}`,
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

    if (role === "collector") {
      if (clusterId) {
        await databaseAPI.update<ClusterEntity>("cluster", clusterId, {
          $addToSet: { collectors: createdCollaborator.id },
        });
      } else {
        // NB! Cleanup!
        client.api(`users/${createdCollaborator.id}`).delete();
        context.res = {
          body:
            "You tried adding a collector without providing a corresponding clusterId. That is an error",
          statusCode: 500,
        };
      }
    }

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

type UserDTO = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  // NB! Needs to be a string because it can contain letters such as 4A
  streetNumber: number;
  city: string;
  zipCode: number;
  phoneNumber: string;
  companyName?: string;
  clusterId?: string;
  role: UserRole;
};

export default httpTrigger;
