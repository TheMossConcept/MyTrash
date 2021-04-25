import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  const openClusters = await databaseAPI.find<ClusterEntity>("cluster", {
    open: true,
  });
  // TODO: The frontend relies on this particular return value format. Consider
  // whether that is too hard of a coupling and we need a gateway instead, or
  // if it is acceptable for now, given the scope of the project
  const returnValue: GetOpenClustersDTO[] = openClusters.map((openCluster) => {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: openCluster._id,
      displayName: openCluster.name,
    };
  });

  context.res = {
    body: JSON.stringify(returnValue),
  };
};

type GetOpenClustersDTO = {
  id: string;
  displayName: string;
};

export default httpTrigger;
