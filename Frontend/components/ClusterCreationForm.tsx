import axios from "axios";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { AccessTokenContext } from "../navigation/TabNavigator";
import axiosUtils from "../utils/axios";
import AutocompleteInput from "./InputElements/AutocompleteInput";
import StringInput from "./InputElements/StringInput";
import DismissableSnackbar from "./shared/DismissableSnackbar";

type Props = {};

type UserInputProps = {
  title?: string;
  usersEndpoint: string;
  selectionState: [string, Dispatch<SetStateAction<string>>];
};

const ClusterCreationForm: FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [userSelectionData, setUserSelectionData] = useState<UserInputProps[]>(
    []
  );

  const [name, setName] = useState<string | undefined>();
  const [c5Reference, setC5Reference] = useState<string | undefined>();
  const productionPartnerSelectionState = useState("");
  const collectionAdministratorSelectionState = useState("");
  const logisticsPartnerSelectionState = useState("");
  const recipientPartnerSelectionState = useState("");

  const resetState = () => {
    const [, setProductionPartner] = productionPartnerSelectionState;
    const [
      ,
      setCollectionAdministrator,
    ] = collectionAdministratorSelectionState;
    const [, setLogisticsPartner] = logisticsPartnerSelectionState;

    setName(undefined);
    setProductionPartner("");
    setCollectionAdministrator("");
    setLogisticsPartner("");
  };

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

  return (
    <View style={styles.container}>
      <StringInput label="Navn" stringState={[name, setName]} />
      <StringInput
        label="C5 Reference"
        stringState={[c5Reference, setC5Reference]}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        userSelectionData.map((selectionData) => (
          /* TODO: Get a better key !! */
          <View
            style={styles.autocompleteInputContainer}
            key={selectionData.title}
          >
            <AutocompleteInput
              selectionState={selectionData.selectionState}
              endpoint={selectionData.usersEndpoint}
              title={selectionData.title}
            />
          </View>
        ))
      )}
      <Button title="Opret cluster" onPress={onCreateCluster} />
      <DismissableSnackbar
        title="Clusteret blev oprettet"
        showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "auto",
    // Obviously, this is just a temporary layout "fix"
    height: "250px",
  },
  autocompleteInputContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
  },
});

export default ClusterCreationForm;
