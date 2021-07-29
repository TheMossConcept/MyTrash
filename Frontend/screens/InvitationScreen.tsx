import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import MainContentArea from "../components/styled/MainContentArea";
import MobileButton from "../components/styled/MobileButton";
import { RootStackParamList } from "../typings/types";
import globalStyles from "../utils/globalStyles";

type Props = StackScreenProps<RootStackParamList, "Invitation">;

const InvitationScreen: FC<Props> = ({ route, navigation }) => {
  const { clusterId } = route.params;

  return (
    <MainContentArea containerStyle={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={[globalStyles.subheaderText, styles.text]}>
          Du er blevet inviteret til et cluster i app&apos;en MyTrash. Du kan
          melde dig til clusteret her.
        </Text>
        <View style={styles.signUpButtonsContainer}>
          <MobileButton
            text="Meld dig til clusteret"
            onPress={() => navigation.navigate("Join", { clusterId })}
            isVerticalButton
            style={styles.signUpButton}
            icon={{
              src: require("../assets/icons/notepad_grey.png"),
              width: 34,
              height: 34,
            }}
          />
        </View>
        <Text style={[globalStyles.subheaderText, styles.text]}>
          Du kan downloade app&apos;en ved at klikke på et at de to links eller
          søge på MyTrash i App Store eller Google Play Store.
        </Text>
        <View style={styles.storeButtonsContainer}>
          <Image
            style={styles.appStoreButton}
            source={require("../assets/icons/Google_play_store.png")}
          />
          <Image
            style={styles.appStoreButton}
            source={require("../assets/icons/App_store.png")}
          />
        </View>
      </View>
    </MainContentArea>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100vh",
    alignItems: "center",
  },
  text: {
    marginBottom: 32,
    width: "50%",
    textAlign: "center",
  },
  signUpButtonsContainer: {
    alignItems: "center",
    width: "100%",
  },
  signUpButton: {
    marginBottom: 32,
    width: "60%",
  },
  storeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appStoreButton: {
    height: 256,
    width: 256,
  },
});

export default InvitationScreen;
