import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useEffect, useMemo, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { StyleSheet, Text, View } from "react-native";
import AdministrationScreen from "../screens/AdministrationScreen";
import CollectionAdministrationScreen from "../screens/CollectionAdministrationScreen";
import CollectionScreen from "../screens/CollectionScreen";
import LogisticsScreen from "../screens/LogisticsScreen";
import ProductionScreen from "../screens/ProductionScreen";
import RecipientScreen from "../screens/RecipientScreen";
import { TabsParamList, RootStackParamList, AppRole } from "../typings/types";
import NoAccess from "../screens/NoAccess";
import MainContentArea from "../components/styled/MainContentArea";
import HeadlineText from "../components/styled/HeadlineText";
import Menu from "../components/shared/Menu";
import TabBar from "../components/styled/TabBar";
import platform from "../utils/platform";
import useQueriedData from "../hooks/useQueriedData";
import HoueLogo from "../components/styled/HoueLogo";

const Tab = createMaterialTopTabNavigator<TabsParamList>();

type UserInfo = {
  name: string;
  userId: string;
  isAdministrator: boolean;
  isCollectionAdministrator: boolean;
  isCollector: boolean;
  isLogisticsPartner: boolean;
  isRecipientPartner: boolean;
  isProductionPartner: boolean;
  userHasNoAccess: boolean;
};

type Props = StackScreenProps<RootStackParamList, "Root">;

// TODO: Too much is going on in here! Split it out at some point
const TabNavigator: FC<Props> = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

  useEffect(() => {
    const updateUserInfo = async () => {
      const rawUserInfo = await AsyncStorage.getItem("userInfo");
      if (rawUserInfo) {
        const userInfoFromStorage = JSON.parse(rawUserInfo);
        setUserInfo(userInfoFromStorage);
      }
    };

    updateUserInfo();

    return () => setUserInfo(undefined);
  }, []);

  const welcomeText = userInfo?.name
    ? `Velkommen ${userInfo.name}.`
    : "Velkommen.";

  return userInfo ? (
    <SafeAreaProvider>
      {platform.platformName === "web" ? (
        <View style={{ height: "100vh" }}>
          <MainContentArea>
            <View style={styles.menuSection}>
              <Menu />
              <HoueLogo />
            </View>
            <HeadlineText text={welcomeText} style={styles.nameText} />
            <Navigator userInfo={userInfo} isWeb />
          </MainContentArea>
        </View>
      ) : (
        <Navigator userInfo={userInfo} />
      )}
    </SafeAreaProvider>
  ) : (
    <Text>No user info</Text>
  );
};

type NavigatorProps = {
  userInfo: UserInfo;
  isWeb?: boolean;
};

const Navigator: FC<NavigatorProps> = ({ userInfo, isWeb = false }) => {
  const { data: appRoles } = useQueriedData<AppRole[]>("GetAppRoles/");
  const administratorDisplayName = appRoles?.find(
    (appRole) => appRole.id === "Administrator"
  )?.displayName;
  const collectionAdministratorDisplayName = appRoles?.find(
    (appRole) => appRole.id === "CollectionAdministrator"
  )?.displayName;
  const collectorDisplayName = appRoles?.find(
    (appRole) => appRole.id === "Collector"
  )?.displayName;
  const logisticsPartnerDisplayName = appRoles?.find(
    (appRole) => appRole.id === "LogisticsPartner"
  )?.displayName;
  const recipientPartnerDisplayName = appRoles?.find(
    (appRole) => appRole.id === "RecipientPartner"
  )?.displayName;
  const productionPartnerDisplayName = appRoles?.find(
    (appRole) => appRole.id === "ProductionPartner"
  )?.displayName;

  console.log("Rendering TabNavigator");
  const initialParams = useMemo(() => {
    return { userId: userInfo.userId };
  }, [userInfo.userId]);

  const partnerAccessingMobile =
    (userInfo.isAdministrator ||
      userInfo.isCollectionAdministrator ||
      userInfo.isLogisticsPartner ||
      userInfo.isRecipientPartner ||
      userInfo.isProductionPartner) &&
    !isWeb;

  const collectorAccessingWeb = userInfo.isCollector && isWeb;

  return (
    <Tab.Navigator
      initialRouteName="Administration"
      tabBar={(props) =>
        props.state.routes.length > 1 ? <TabBar {...props} /> : null
      }
    >
      {userInfo.isAdministrator && isWeb && (
        <Tab.Screen
          name="Administration"
          component={AdministrationScreen}
          options={{
            tabBarLabel: administratorDisplayName,
          }}
        />
      )}
      {userInfo.isCollectionAdministrator && isWeb && (
        <Tab.Screen
          name="Indsamlingsadministration"
          component={CollectionAdministrationScreen}
          initialParams={{ userId: userInfo.userId }}
          options={{
            tabBarLabel: collectionAdministratorDisplayName,
          }}
        />
      )}
      {userInfo.isCollector && !isWeb && (
        <Tab.Screen
          name="Indsamling"
          component={CollectionScreen}
          initialParams={initialParams}
          options={{
            tabBarLabel: collectorDisplayName,
          }}
        />
      )}
      {userInfo.isLogisticsPartner && isWeb && (
        <Tab.Screen
          name="Logistik"
          component={LogisticsScreen}
          initialParams={{ userId: userInfo.userId }}
          options={{
            tabBarLabel: logisticsPartnerDisplayName,
          }}
        />
      )}
      {userInfo.isRecipientPartner && isWeb && (
        <Tab.Screen
          name="Modtagelse"
          component={RecipientScreen}
          initialParams={{ userId: userInfo.userId }}
          options={{
            tabBarLabel: recipientPartnerDisplayName,
          }}
        />
      )}
      {userInfo.isProductionPartner && isWeb && (
        <Tab.Screen
          name="Produktion"
          component={ProductionScreen}
          initialParams={{ userId: userInfo.userId }}
          options={{
            tabBarLabel: productionPartnerDisplayName,
          }}
        />
      )}
      {userInfo.userHasNoAccess && (
        <Tab.Screen name="NoAccess" component={NoAccess} />
      )}
      {partnerAccessingMobile && (
        <Tab.Screen
          name="NoPartnerOnMobile"
          component={NoAccess}
          initialParams={{
            text: "En partner kan kun benytte MyTrash via webinterfacet. Log ud og log ind igen som en indsamler, eller log ind på webinterfacet",
          }}
        />
      )}
      {collectorAccessingWeb && (
        <Tab.Screen
          name="NoCollectorOnWeb"
          component={NoAccess}
          initialParams={{
            text: "En indsamler kan kun tilgå MyTrash via mobil app'en. Log på mobil app'en som kan hentes i App Store eller Play Store i stedet",
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  menuSection: {
    marginBottom: 55,
    paddingHorizontal: 107,
    flexDirection: "column",
    width: "100%",
  },
  nameText: {
    alignItems: "flex-start",
    marginBottom: 24,
  },
});

export default TabNavigator;
