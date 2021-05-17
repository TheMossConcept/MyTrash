import * as df from "durable-functions";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpStart: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  const client = df.getClient(context);
  // Replace "Hello" with the name of your Durable Activity Function.
  // outputs.push(yield context.df.callActivity("Hello", "Tokyo"));
  /*
  outputs.push(yield context.df.callActivity("Hello", "Seattle"));
  outputs.push(yield context.df.callActivity("Hello", "London"));
  */

  // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
  const instanceId = await client.startNew(
    req.params.functionName,
    undefined,
    req.body
  );

  context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};

export default httpStart;
