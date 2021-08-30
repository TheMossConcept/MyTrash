import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import { isEmpty } from "lodash";
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
    const cluster = await databaseAPI.findById<ClusterEntity>(
      "cluster",
      clusterId
    );

    const idsOfCollectors = cluster.collectors || [];

    const rectifiedIdOfCollectors = idsOfCollectors.filter(
      (idOfCollector) => idOfCollector !== null && idOfCollector !== undefined
    );

    // We get an UnsupportedQuery from the Microsoft Graph API if we
    // try to filter with an empty array
    if (isEmpty(rectifiedIdOfCollectors)) {
      context.res = {
        body: JSON.stringify(rectifiedIdOfCollectors),
      };
    } else {
      // Make sure the array is valid for use in the graph filtering query!
      const rectifiedFilteringArray = JSON.stringify(
        rectifiedIdOfCollectors
      ).replace('/"/g', "'");

      // Please note that this is the client id of the b2c-extensions-app and NOT of the actual app registration itself!
      // Also note that the -'s have been removed
      const clientId = process.env.ClientId;
      const selectionString = `extension_${clientId}_CollectionGoal,id,displayName`;

      // TODO: We should also find a way to have type safety towards the Graph API
      const collectors = await client
        .api(
          `/users?$select=${selectionString}&$filter=id in ${rectifiedFilteringArray}`
        )
        .get();

      // Right here it is not worth it to explicitly define the type since it depends on clientId and is already implicitly defined by the selectionString
      const returnValue = collectors.value.map((collector: any) => {
        // Make the return value understandable for the client. TODO: Investigate whether this can be done automatically in the graph query! (it probably can)
        return {
          collectionGoal: collector[`extension_${clientId}_CollectionGoal`],
          displayName: collector.displayName,
          id: collector.id,
        };
      });

      context.res = {
        body: JSON.stringify(returnValue),
      };
    }
  } catch (error) {
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under hentningen af indsamlerne",
      rawError: error.toString(),
    });

    context.res = {
      body,
      statusCode: 500,
    };
  }
};

export default httpTrigger;
