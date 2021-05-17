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
  console.log("WE ARE IN CREATE COLLECTOR!");
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

    // TODO: Fix hardcoding. Please note that t his is the client id of the b2c-extensions-app
    // and NOT of the actual app registration itself! Also note that the -'s have been removed
    const clientId = "efe81d2e0be34a3e87eb2cffd57626ce";

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
        forceChangePasswordNextSignIn: false,
        password: "Test1234!",
      },
      // passwordPolicies: "DisablePasswordExpiration",
      ...extensionsObject,
    });

    return createdUser.id;
  } catch (e) {
    context.res = {
      body: JSON.stringify(e),
      statusCode: 500,
    };
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
