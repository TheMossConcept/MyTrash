import React, { FC, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import AutocompleteInput from "../components/inputs/AutocompleteInput";
import { RootStackParamList } from "../typings/types";
import CollectorForm from "../components/user/CollectorForm";
import MainContentArea from "../components/styled/MainContentArea";
import MobileButton from "../components/styled/MobileButton";
import platform from "../utils/platform";
import globalStyles from "../utils/globalStyles";

type Props = StackScreenProps<RootStackParamList, "Join">;

const JoinClusterForm: FC<Props> = ({ route, navigation }) => {
  const [showSignUpConfirmation, setShowSignUpConfirmation] = useState(false);
  const { clusterId } = route.params || {};
  // NB! canGoBack should not be used in render as it does not
  // re-render the screen when the result changes, however, for this
  // particular use case, we only want
  const { goBack, canGoBack } = navigation;

  const collectorSuccessCallback = () => {
    if (platform.platformName === "web") {
      setShowSignUpConfirmation(true);
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <ScrollView>
      <MainContentArea>
        {canGoBack && (
          <View style={styles.backButtonContainer}>
            <MobileButton
              icon={{
                src: require("../assets/icons/back.png"),
                width: 25,
                height: 25,
              }}
              isVerticalButton
              onPress={goBack}
            />
          </View>
        )}
        {showSignUpConfirmation ? (
          <Text style={globalStyles.subheaderText}>
            Du er nu tilmeldt clusteret. Log ind på MyTrash app&apos;en for at
            begynde at samle skrald
          </Text>
        ) : (
          <CollectorForm
            title="Tilmeld"
            style={styles.collectorForm}
            clusterId={clusterId}
            successCallback={collectorSuccessCallback}
          >
            {clusterId === undefined && (
              <AutocompleteInput
                formKey="clusterId"
                endpoint="/GetOpenClusters"
                title="Cluster"
              />
            )}
          </CollectorForm>
        )}
      </MainContentArea>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 23,
  },
  collectorForm: {
    paddingBottom: 40,
  },
});

export default JoinClusterForm;
