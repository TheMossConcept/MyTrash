import "isomorphic-fetch";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {Client} from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from './CustomAuthenticationProvider'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // TODO: Move this extraction of the header to the XMsClientPrincipalAuthenticationProvider
  const accessToken = req.headers["access-token"];

  if (accessToken){
    try {
      const clientOptions = {
        authProvider: new CustomAuthenticationProvider(accessToken)
      }
      const client = Client.initWithMiddleware(clientOptions)
      const userDetails = await client.api("/me").get();

      context.res = { 
        body: JSON.stringify(userDetails)
      }
    } catch (error) {
      context.res = {
        body: `${JSON.stringify(error)}. The access token used is: ${accessToken}`,
        statusCode: '500'
      }
    }
  } else {
    context.res = { 
      body: "Missing access-token header!!"
    }
  }

};

export default httpTrigger;
