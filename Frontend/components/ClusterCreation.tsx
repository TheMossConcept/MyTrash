import axios from "axios";
import React, { FC, useContext, useEffect } from "react";
import { AccessTokenContext } from "../navigation/TabNavigator";
import axiosUtils from "../utils/axios";

type Props = {};

const ClusterCreation: FC<Props> = ({}) => {
  const accessToken = useContext(AccessTokenContext);

  // Only run data fetch once, otherwise the state update of an
  // array will cause an infinite reload because it is a new instance
  // each time
  useEffect(() => {
    if (accessToken) {
      axios
        .get("/GetAppRoles", {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((appRolesResult) => {
          const appRoles: any[] = appRolesResult.data;
          const localUserSelectionData = appRoles.map((appRole) => {
            const appRoleId = appRole.id;
            const appRoleValue = appRole.value;
            const title: string | undefined = appRole.displayName;

            const usersEndpoint = `/GetUsersByAppRole?appRoleId=${appRoleId}`;

            let selectionState;
            switch (appRoleValue) {
              case "ProductionPartner":
                selectionState = productionPartnerSelectionState;
                break;
              case "CollectionAdministrator":
                selectionState = collectionAdministratorSelectionState;
                break;
              case "LogisticsPartner":
                selectionState = logisticsPartnerSelectionState;
                break;
              case "RecipientPartner":
                selectionState = recipientPartnerSelectionState;
                break;
              default:
                console.warn("DEFAULT CASE IN CLUSTER CREATION FORM!!");
                break;
            }

            return selectionState
              ? {
                  title,
                  usersEndpoint,
                  selectionState,
                }
              : undefined;
          });

          const localUserSelectionDataRectified = localUserSelectionData.filter(
            (selectionData) => selectionData !== undefined
          ) as UserInputProps[];

          setUserSelectionData(localUserSelectionDataRectified);
        })
        .finally(() => setLoading(false));

      setLoading(true);
    }
  }, [accessToken]);

  const [productionPartnerId] = productionPartnerSelectionState;
  const [collectionAdministratorId] = collectionAdministratorSelectionState;
  const [logisticsPartnerId] = logisticsPartnerSelectionState;

  const onCreateCluster = () => {
    if (accessToken) {
      axios
        .post(
          "/CreateCluster",
          {
            name,
            productionPartnerId,
            collectionAdministratorId,
            logisticsPartnerId,
          },
          {
            params: {
              code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
            },
            ...axiosUtils.getSharedAxiosConfig(accessToken),
          }
        )
        .then(() => {
          setShowSuccessSnackbar(true);
          resetState();
        });
    }
  };
};

export default ClusterCreation;
