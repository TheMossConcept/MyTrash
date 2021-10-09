import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
        <StoreButton
          linkUrl="https://play.google.com/store/apps/details?id=com.houe.mytrash&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
          imageUrl="https://play.google.com/intl/en_us/badges/static/images/badges/da_badge_web_generic.png"
        />
        <StoreButton
          linkUrl="https://apps.apple.com/dk/app/mytrash/id1583638098?itsct=apps_box_badge&amp;itscg=30200"
          imageUrl="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/da-dk?size=250x83&amp;releaseDate=1632096000&h=b68bed30e832a9bef5b914ddec097a01"
        />
      </View>
    </MainContentArea>
  );
};

type StoreButtonProps = {
  linkUrl: string;
  imageUrl: string;
};

const StoreButton: FC<StoreButtonProps> = ({ linkUrl, imageUrl }) => {
  return (
    <View style={styles.storeButtonLink}>
      <TouchableOpacity onPress={() => Linking.openURL(linkUrl)}>
        <Image
          source={{
            uri: imageUrl,
            width: 250,
            height: 83,
          }}
          style={styles.storeButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100vh",
    alignItems: "center",
  },
  text: {
    marginBottom: 32,
    textAlign: "center",
  },
  signUpButtonsContainer: {
    alignItems: "center",
  },
  signUpButton: {
    marginBottom: 32,
  },
  storeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  storeButtonLink: {
    overflow: "hidden",
    borderRadius: 13,
  },
  storeButtonImage: {
    borderRadius: 13,
    width: 250,
    height: 83,
  },
});

export default InvitationScreen;
