/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";
import { allUserRoles } from "../utils/DatabaseAPI";

const CreateCollector: AzureFunction = async function (
  context: Context
): Promise<string> {
  try {
    const requestBody: CollectorDTO = context.bindings.collector;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      street,
      streetNumber,
      city,
      zipCode,
    } = requestBody;

    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    // Please note that this is the client id of the b2c-extensions-app and NOT of the actual app registration itself!
    // Also note that the -'s have been removed
    const clientId = process.env.ClientId;
    // This is linked to hte Azure B2C instance used
    const issuer = process.env.ADIssuer;

    const extensionsObject = allUserRoles.reduce(
      (accumulator, currentValue) => {
        const newValue = {
          [`extension_${clientId}_${currentValue}`]:
            currentValue === "Collector",
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
      ...extensionsObject,
    });

    return createdUser.id;
  } catch (error) {
    let errorMessage = "Der skete en fejl under oprettelsen af brugeren";
    // TODO: Find a less brittle way to do this than to rely on a human readable error message!
    if (
      error.message ===
      "Another object with the same value for property userPrincipalName already exists."
    ) {
      errorMessage =
        "Der findes allerede en bruger med denne email. Prøv med en anden email eller slet den eksisterende bruger";
    }

    const body = JSON.stringify({
      errorMessage,
      rawError: error,
    });

    throw new Error(body);
  }
};

export default CreateCollector;

export type CollectorDTO = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: number;
  phoneNumber: string;
  clusterId: string;
};
