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

const orchestrator = df.orchestrator(function* (context) {
  const testUser = {
    firstName: "Durable",
    lastName: "test",
    email: "durable@test.dk",
    phoneNumber: "12345678",
    street: "Test",
    streetNumber: "4A",
    city: "Test",
    zipCode: 8600,
    role: "Administrator",
  };
  const test = yield context.df.callActivity("CreateUserActivity", testUser);
  // Replace "Hello" with the name of your Durable Activity Function.
  // outputs.push(yield context.df.callActivity("Hello", "Tokyo"));
  /*
  outputs.push(yield context.df.callActivity("Hello", "Seattle"));
  outputs.push(yield context.df.callActivity("Hello", "London"));
  */

  // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
  return test;
});

export default orchestrator;
