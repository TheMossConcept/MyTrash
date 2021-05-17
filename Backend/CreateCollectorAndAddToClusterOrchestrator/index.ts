/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

import * as df from "durable-functions";
import { AddCollectorToClusterPayload } from "../AddCollectorToClusterActivity";
import { CollectorDTO } from "../CreateCollectorActivity";

const orchestrator = df.orchestrator(function* (context) {
  const { clusterId, ...user } = context.bindingData.input as RequestBody;

  const userId = yield context.df.callActivity("CreateCollectorActivity", user);
  const updatedEntity = yield context.df.callActivity(
    "AddCollectorToClusterActivity",
    {
      userId,
      clusterId,
    }
  );

  return JSON.stringify(updatedEntity);
});

type RequestBody = Omit<AddCollectorToClusterPayload, "userId"> & CollectorDTO;

export default orchestrator;
