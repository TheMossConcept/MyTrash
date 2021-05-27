import { AzureFunction, Context, HttpRequest } from "@azure/functions";
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
      searchString,
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

    const searchStringQuery = searchString
      ? {
          name: { $exists: true, $regex: `.*${searchString}.*`, $options: "i" },
        }
      : undefined;

    const query = {};
    Object.assign(query, limitUserQuery, searchStringQuery);

    const {
      result: clusters,
      hasNextPage,
    } = await databaseAPI.findPaginated<ClusterEntity>(
      "cluster",
      pageNumber,
      query
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
      body: JSON.stringify({ value: returnValue, pagination: { hasNextPage } }),
    };
  } catch (e) {
    context.res = {
      body: JSON.stringify(e),
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
};

export default httpTrigger;
