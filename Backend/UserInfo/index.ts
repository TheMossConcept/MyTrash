import "isomorphic-fetch";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {Client} from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from '../CustomAuthenticationProvider'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const clientOptions = {
      authProvider: new CustomAuthenticationProvider(req.headers)
    }
    const client = Client.initWithMiddleware(clientOptions)
    const userDetails = await client.api("/me").get();

    context.res = { 
      body: JSON.stringify(userDetails)
    }
  } catch (error) {
    context.res = {
      body: `${JSON.stringify(error)}`,
      statusCode: '500'
    }
  }
};

export default httpTrigger;
