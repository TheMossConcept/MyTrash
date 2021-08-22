import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

type Payload = { clusterId: string };

type ClusterFromDb = ClusterEntity & { _id: string };

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const { clusterId } = req.query as Payload;

    const cluster = await databaseAPI.findById<ClusterFromDb>(
      "cluster",
      clusterId
    );
    // TODO: The frontend relies on this particular return value format. Consider
    // whether that is too hard of a coupling and we need a gateway instead, or
    // if it is acceptable for now, given the scope of the project
    const { _id, necessaryAmountOfPlastic, open, ...clusterToReturn } = cluster;
    const returnValue: GetClusterDTO = {
      id: _id,
      necessaryPlastic: necessaryAmountOfPlastic,
      isOpen: open,
      ...clusterToReturn,
    };

    context.res = {
      body: JSON.stringify(returnValue),
    };
  } catch (error) {
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under hentning af clusteret",
      rawError: error,
    });
    context.res = {
      body,
    };
  }
};

type GetClusterDTO = {
  id: string;
  necessaryPlastic: number;
  isOpen: boolean;
} & Omit<ClusterEntity, "necessaryAmountOfPlastic" | "open">;

export default httpTrigger;
