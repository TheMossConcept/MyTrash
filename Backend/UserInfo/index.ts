import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {Client} from "@microsoft/microsoft-graph-client";
import XMsClientPrincipalAuthenticationProvider from "./XMsClientPrincipalAuthenticationProvider";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  // TODO: Move this extraction of the header to the XMsClientPrincipalAuthenticationProvider
  const accessToken = req.headers["x-ms-client-principal"];

  if (accessToken){
    try {
      const clientOptions = {
        authProvider: new XMsClientPrincipalAuthenticationProvider(accessToken)
      }
      const client = Client.initWithMiddleware(clientOptions)
        const userDetails = await client.api("/me").get();

      context.res = { 
        body: JSON.stringify(userDetails)
      }
    } catch (error) {
      context.res = {
        body: JSON.stringify(error)
      }
    }
  } else {
    context.res = { 
      body: "Missing x-ms-client-principal header!!"
    }
  }

};

export default httpTrigger;
