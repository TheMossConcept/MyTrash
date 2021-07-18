import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { TabsParamList } from "../typings/types";
import PlasticCollectionsDetails, {
  PlasticCollection,
} from "../components/collection/PlasticCollectionsDetails";
import sortCollectionsByStatus from "../utils/plasticCollections";
import SchedulePlasticCollection from "../components/collection/SchedulePlasticCollection";
import DeliverPlasticCollection from "../components/collection/DeliverPlasticCollection";
import Container from "../components/shared/Container";
import useAxiosConfig from "../hooks/useAxiosConfig";
import ContextSelector from "../components/styled/ContextSelector";
import WebButton from "../components/styled/WebButton";
import InformationField from "../components/styled/InformationField";

type Props = StackScreenProps<TabsParamList, "Logistik">;

const LogisticsScreen: FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  const sharedAxiosConfig = useAxiosConfig();

  const fetchPlasticCollections = useCallback(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { logisticsPartnerId: userId },
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [sharedAxiosConfig, userId]);

  // Do an initial plastic collections fetch
  useEffect(() => {
    fetchPlasticCollections();
  }, [fetchPlasticCollections]);

  const sortedCollections = sortCollectionsByStatus(plasticCollections);

  const contextSelectionState = useState("Afventer");
  const [selectedContext] = contextSelectionState;

  return (
    <Container>
      <ContextSelector
        // TODO: Change to an ENUM and make the ContextSelector generic!
        options={["Afventer", "Planlagt", "Afhentet", "Bekræftet"]}
        selectionState={contextSelectionState}
      >
        <WebButton
          text="Booking dato"
          icon={{
            src: require("../assets/icons/calendar_grey.png"),
            width: 25,
            height: 25,
          }}
          style={styles.filterButton}
        />
        <View style={{ flex: 1 }}>
          {selectedContext === "Afventer" && (
            <PlasticCollectionsDetails
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
                    plasticCollectionScheduledCallback={fetchPlasticCollections}
                  />
                </View>
              )}
            </PlasticCollectionsDetails>
          )}
        </View>
        {selectedContext === "Planlagt" && (
          <PlasticCollectionsDetails
            plasticCollections={sortedCollections.scheduled}
          >
            {(collection) => (
              <DeliverPlasticCollection
                plasticCollectionId={collection.id}
                successCallback={fetchPlasticCollections}
              />
            )}
          </PlasticCollectionsDetails>
        )}
        {selectedContext === "Afhentet" && (
          <PlasticCollectionsDetails
            plasticCollections={sortedCollections.delivered}
          />
        )}
        {selectedContext === "Bekræftet" && (
          <PlasticCollectionsDetails
            plasticCollections={sortedCollections.received}
          />
        )}
      </ContextSelector>
    </Container>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    width: 512,
    marginBottom: 23,
  },
  informationTextField: {
    marginBottom: 23,
  },
});

export default LogisticsScreen;
