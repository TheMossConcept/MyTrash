import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useState } from "react";
import { View, StyleSheet } from "react-native";

import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import SchedulePlasticCollection from "../components/collection/SchedulePlasticCollection";
import DeliverPlasticCollection from "../components/collection/DeliverPlasticCollection";
import Container from "../components/shared/Container";
import ContextSelector from "../components/styled/ContextSelector";
import InformationField from "../components/styled/InformationField";
import useQueriedData from "../hooks/useQueriedData";
import LoadingIndicator from "../components/styled/LoadingIndicator";

type Props = StackScreenProps<TabsParamList, "Logistik">;

const LogisticsScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;

  // TODO: Consider making this its own hook at some point!
  const [sortKey, setSortKey] = useState<string | undefined>();
  const toggleSorting = (localSortKey: string) => (shouldSort: boolean) => {
    if (shouldSort) {
      setSortKey(localSortKey);
    } else {
      setSortKey(undefined);
    }
  };

  const { data, refetch, isLoading } = useQueriedData<PlasticCollection[]>(
    "/GetPlasticCollections",
    { logisticsPartnerId: userId, sortBy: sortKey }
  );
  const sortedCollections = sortCollectionsByStatus(data || []);

  const contextSelectionState = useState("Afventer");
  const [selectedContext] = contextSelectionState;

  return (
    <Container>
      <ContextSelector
        // TODO: Change to an ENUM and make the ContextSelector generic!
        options={["Afventer", "Planlagt", "Afhentet", "Bekræftet"]}
        selectionState={contextSelectionState}
      >
        <View>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <View>
              {selectedContext === "Afventer" && (
                <PlasticCollectionsDetails
                  sorting={{
                    displayName: "oprettelsesdato",
                    sortState: [
                      sortKey === "createdAt",
                      toggleSorting("createdAt"),
                    ],
                  }}
                  plasticCollections={sortedCollections.pending}
                >
                  {(collection) => (
                    <View>
                      {collection.isFirstCollection && (
                        <InformationField
                          value="NB! Dette er første opsamling"
                          style={styles.informationTextField}
                        />
                      )}
                      {collection.isLastCollection && (
                        <InformationField
                          value="NB! Dette er sidste opsamling"
                          style={styles.informationTextField}
                        />
                      )}
                      <SchedulePlasticCollection
                        plasticCollectionId={collection.id}
                        plasticCollectionScheduledCallback={refetch}
                      />
                    </View>
                  )}
                </PlasticCollectionsDetails>
              )}
            </View>
          )}
        </View>
        {selectedContext === "Planlagt" && (
          <PlasticCollectionsDetails
            plasticCollections={sortedCollections.scheduled}
            sorting={{
              displayName: "planlagt dato",
              sortState: [
                sortKey === "scheduledPickupDate",
                toggleSorting("scheduledPickupDate"),
              ],
            }}
          >
            {(collection) => (
              <View>
                <SchedulePlasticCollection
                  plasticCollectionId={collection.id}
                  plasticCollectionScheduledCallback={refetch}
                />
                <DeliverPlasticCollection
                  plasticCollectionId={collection.id}
                  successCallback={refetch}
                />
              </View>
            )}
          </PlasticCollectionsDetails>
        )}
        {selectedContext === "Afhentet" && (
          <PlasticCollectionsDetails
            plasticCollections={sortedCollections.delivered}
            sorting={{
              displayName: "afhentet dato",
              sortState: [
                sortKey === "deliveryDate",
                toggleSorting("deliveryDate"),
              ],
            }}
          />
        )}
        {selectedContext === "Bekræftet" && (
          <PlasticCollectionsDetails
            plasticCollections={sortedCollections.received}
            sorting={{
              displayName: "modtaget dato",
              sortState: [
                sortKey === "receivedDate",
                toggleSorting("receivedDate"),
              ],
            }}
          />
        )}
      </ContextSelector>
    </Container>
  );
};

const styles = StyleSheet.create({
  informationTextField: {
    marginBottom: 23,
  },
});

export default LogisticsScreen;
