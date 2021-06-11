import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import CustomAuthenticationProvider from "../utils/CustomAuthenticationProvider";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // TODO: Add pagination here like on the GetClusters endpoint and all the other plural get endpoints!
  try {
    const customAuthProvider = new CustomAuthenticationProvider();
    const client = Client.initWithMiddleware({
      authProvider: customAuthProvider,
    });

    const { clusterId } = req.query;

    // TODO: Consider whether it is a good idea to have two different return values
    // depending on the request issued!
    const {
      collectors: idsOfCollectors,
    } = await databaseAPI.findById<ClusterEntity>("cluster", clusterId);

    // Make sure the array is valid for use in the graph filtering query!
    const rectifiedFilteringArray = JSON.stringify(idsOfCollectors).replace(
      '/"/g',
      "'"
    );

    const collectors = await client
      .api(`/users?$filter=id in ${rectifiedFilteringArray}`)
      .get();

    context.res = {
      body: JSON.stringify(collectors),
    };
  } catch (e) {
    context.res = {
      body: JSON.stringify(e),
    };
  }
};

export default httpTrigger;
