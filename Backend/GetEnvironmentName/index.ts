import { AzureFunction, Context } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: process.env.EnvironmentName,
  };
};

export default httpTrigger;

