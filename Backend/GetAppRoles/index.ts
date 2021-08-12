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
        return {
          id: userRole,
          multilineDisplayName: "Adm. - HOUE",
          displayName: "Administration - HOUE",
        };
      if (userRole === "CollectionAdministrator")
        return {
          id: userRole,
          multilineDisplayName: "Adm. - Partner",
          displayName: "Administration - partner",
        };
      if (userRole === "Collector")
        return {
          id: userRole,
          multilineDisplayName: "Indsamler",
          displayName: "Indsamler",
        };
      if (userRole === "LogisticsPartner")
        return {
          id: userRole,
          multilineDisplayName: `Logistik-\npartner`,
          displayName: "Logistikpartner",
        };
      if (userRole === "RecipientPartner")
        return {
          id: userRole,
          multilineDisplayName: "Modtager-\npartner",
          displayName: "Modtagerpartner",
        };
      if (userRole === "ProductionPartner")
        return {
          id: userRole,
          multilineDisplayName: "Produktions-\npartner",
          displayName: "Produktionspartner",
        };

      // NB! This should never happen!
      return { id: userRole, displayName: userRole };
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
