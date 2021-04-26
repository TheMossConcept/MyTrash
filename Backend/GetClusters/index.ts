import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const {
    collectionAdministratorId,
    logisticsPartnerId,
    productionPartnerId,
    collectorId,
  } = req.query;

  const queryIsLimitedToUser =
    collectionAdministratorId ||
    logisticsPartnerId ||
    productionPartnerId ||
    collectorId;

  const clusters = await databaseAPI.find<ClusterEntity>(
    "cluster",
    queryIsLimitedToUser
      ? {
          $or: [
            {
              collectionAdministratorId: {
                $exists: true,
                $eq: collectionAdministratorId,
              },
            },
            // { logisticsPartnerId },
            { logisticsPartnerId: { $exists: true, $eq: logisticsPartnerId } },
            {
              productionPartnerId: { $exists: true, $eq: productionPartnerId },
            },
            { collectors: { $exists: true, $eq: collectorId } },
          ],
        }
      : undefined
  );
  // TODO: The frontend relies on this particular return value format. Consider
  // whether that is too hard of a coupling and we need a gateway instead, or
  // if it is acceptable for now, given the scope of the project
  const returnValue: GetClustersDTO[] = clusters.map((cluster) => {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: cluster._id,
      displayName: cluster.name,
    };
  });

  context.res = {
    body: JSON.stringify(returnValue),
  };
};

type GetClustersDTO = {
  id: string;
  displayName: string;
};

export default httpTrigger;
