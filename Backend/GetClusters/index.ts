import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { omit } from "lodash";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const {
      collectionAdministratorId,
      logisticsPartnerId,
      productionPartnerId,
      collectorId,
      page,
    } = req.query;

    // TODO: Validate this once we start adding end-to-end typing and input validation!
    const pageNumber = Number.parseInt(page, 10) || 0;

    const queryIsLimitedToUser =
      collectionAdministratorId ||
      logisticsPartnerId ||
      productionPartnerId ||
      collectorId;

    const limitUserQuery = queryIsLimitedToUser
      ? {
          $or: [
            {
              collectionAdministratorId: {
                $exists: true,
                $eq: collectionAdministratorId,
              },
            },
            {
              logisticsPartnerId: { $exists: true, $eq: logisticsPartnerId },
            },
            {
              productionPartnerId: {
                $exists: true,
                $eq: productionPartnerId,
              },
            },
            { collectors: { $exists: true, $eq: collectorId } },
          ],
        }
      : undefined;

    // TODO: Consider whether it is a good idea to have two different return values
    // depending on the request issued!
    if (page) {
      const {
        result: clusters,
        hasNextPage,
      } = await databaseAPI.findPaginated<ClusterEntity>(
        "cluster",
        pageNumber,
        limitUserQuery
      );
      // TODO: The frontend relies on this particular return value format. Consider
      // whether that is too hard of a coupling and we need a gateway instead, or
      // if it is acceptable for now, given the scope of the project
      const returnValue: GetClustersDTO[] = clusters.map((cluster) => {
        const clusterValuesToReturn = omit(cluster, ["_id", "entityName"]);

        return {
          // eslint-disable-next-line no-underscore-dangle
          id: cluster._id,
          displayName: cluster.name,
          ...clusterValuesToReturn,
        };
      });

      context.res = {
        body: JSON.stringify({
          value: returnValue,
          pagination: { hasNextPage },
        } as ReturnValue),
      };
    } else {
      const clusters = await databaseAPI.find<ClusterEntity>(
        "cluster",
        limitUserQuery
      );

      const returnValue: GetClustersDTO[] = clusters.map((cluster) => {
        const clusterValuesToReturn = omit(cluster, ["_id", "entityName"]);
        return {
          // eslint-disable-next-line no-underscore-dangle
          id: cluster._id,
          displayName: cluster.name,
          ...clusterValuesToReturn,
        };
      });

      context.res = {
        body: JSON.stringify(returnValue),
      };
    }
  } catch (error) {
    const body = JSON.stringify({
      errorMessage: "Der skete en fejl under hentning af clusterne",
      rawError: error,
    });

    context.res = {
      body,
    };
  }
};

type ReturnValue = {
  value: GetClustersDTO[];
  pagination: { hasNextPage: boolean };
};

type GetClustersDTO = {
  id: string;
  displayName: string;
  // We don't have to omit _id on the type as
  // it is added by the type DatabaseEntity
} & Omit<ClusterEntity, "entityName">;

export default httpTrigger;
