﻿/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context } from "@azure/functions";
import databaseAPI, { ClusterEntity } from "../utils/DatabaseAPI";

const activityFunction: AzureFunction = async function (
  context: Context
): Promise<string> {
  try {
    const { clusterId, userId } = context.bindings
      .payload as AddCollectorToClusterPayload;

    const updatedEntity = await databaseAPI.updateOne<ClusterEntity>(
      "cluster",
      clusterId,
      {
        $addToSet: { collectors: userId },
      }
    );

    return JSON.stringify(updatedEntity);
  } catch (error) {
    const body = JSON.stringify({
      errorMessage:
        "Der skete en fejl i sammenkædningen mellem brugeren og clusteret",
      rawError: error,
    });

    throw new Error(body);
  }
};

export type AddCollectorToClusterPayload = {
  userId: string;
  clusterId: string;
};

export default activityFunction;
