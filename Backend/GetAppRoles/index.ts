import { AzureFunction, Context } from "@azure/functions";
import { allUserRoles } from "../utils/DatabaseAPI";

// TODO: Delete this!
const httpTrigger: AzureFunction = async function (
  context: Context
): Promise<void> {
  try {
    // This is the only endpoint ever dealing with display of user roles
    // and therefore, I think it is sensible to have displayName defined here.
    // If we get more endpoints dealing with that in the future, we should
    // move display name to the role definitions
    const returnValue = allUserRoles.map((userRole) => {
      if (userRole === "Administrator")
        return { roleValue: userRole, displayName: "Administrator" };
      if (userRole === "CollectionAdministrator")
        return { roleValue: userRole, displayName: "Indsamlingsadministrator" };
      if (userRole === "Collector")
        return { roleValue: userRole, displayName: "Indsamler" };
      if (userRole === "LogisticsPartner")
        return { roleValue: userRole, displayName: "Logistikpartner" };
      if (userRole === "RecipientPartner")
        return { roleValue: userRole, displayName: "Modtagerpartner" };
      if (userRole === "ProductionPartner")
        return { roleValue: userRole, displayName: "Produktionspartner" };

      // NB! This should never happen!
      return { roleValue: userRole, displayName: userRole };
    });
    context.res = { body: JSON.stringify(returnValue) };
  } catch (error) {
    context.res = {
      body: `${JSON.stringify(error)}`,
      statusCode: "500",
    };
  }
};

export default httpTrigger;
