import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Text } from "react-native";
import AdministrationScreen from "../screens/AdministrationScreen";
import CollectionAdministrationScreen from "../screens/CollectionAdministrationScreen";
import CollectionScreen from "../screens/CollectionScreen";
import LogisticsScreen from "../screens/LogisticsScreen";
import ProductionScreen from "../screens/ProductionScreen";
import RecipientScreen from "../screens/RecipientScreen";
import { TabsParamList, RootStackParamList } from "../typings/types";
import DismissableSnackbar, {
  useSnackbarState,
} from "../components/shared/DismissableSnackbar";
import NoAccess from "../screens/NoAccess";
import GlobalSnackbarContext from "../utils/globalContext";

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
type TabBarIconProps = {
  focused: boolean;
  color: string;
};

// TODO: Make into a higher order component and parametrize if necessary
const TabBarIcon: FC<TabBarIconProps> = ({ color }) => {
  return (
    <Ionicons
      size={30}
      style={{ marginBottom: -3 }}
      name="ios-code"
      color={color}
    />
  );
};

type Props = StackScreenProps<RootStackParamList, "Root">;

// TODO: Too much is going on in here! Split it out at some point
const TabNavigator: FC<Props> = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

  useEffect(() => {
    const updateUserInfo = async () => {
      const idToken = await AsyncStorage.getItem("idToken");
      if (idToken) {
        const tokenDecoded = jwtDecode(idToken) as any;
        /* eslint-disable camelcase */
        const {
          name,
          oid,
          extension_Administrator,
          extension_CollectionAdministrator,
          extension_Collector,
          extension_LogisticsPartner,
          extension_RecipientPartner,
          extension_ProductionPartner,
        } = tokenDecoded;

        const userHasNoAccess =
          !extension_Administrator &&
          !extension_CollectionAdministrator &&
          !extension_Collector &&
          !extension_LogisticsPartner &&
          !extension_RecipientPartner &&
          !extension_ProductionPartner;

        setUserInfo({
          name,
          userId: oid,
          isAdministrator: extension_Administrator,
          isCollectionAdministrator: extension_CollectionAdministrator,
          isCollector: extension_Collector,
          isLogisticsPartner: extension_LogisticsPartner,
          isRecipientPartner: extension_RecipientPartner,
          isProductionPartner: extension_ProductionPartner,
          userHasNoAccess,
        });
        /* eslint-enable camelcase */
      }
    };

    updateUserInfo();
  }, []);

  const globalSnackbarState = useSnackbarState();
  const [, dispatch] = globalSnackbarState;

  const showSnackbar = useCallback(
    (title: string) => {
      dispatch({ type: "updateTitle", payload: title });
      dispatch({ type: "show" });
    },
    [dispatch]
  );

  return userInfo ? (
    <SafeAreaProvider>
      <GlobalSnackbarContext.Provider value={showSnackbar}>
        <Tab.Navigator initialRouteName="Administration" tabBar={() => null}>
          {false && userInfo.isAdministrator && (
            <Tab.Screen
              name="Administration"
              component={AdministrationScreen}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {false && userInfo.isCollectionAdministrator && (
            <Tab.Screen
              name="Indsamlingsadministration"
              component={CollectionAdministrationScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {(userInfo.isCollector || true) && (
            <Tab.Screen
              name="Indsamling"
              component={CollectionScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {false && userInfo.isLogisticsPartner && (
            <Tab.Screen
              name="Logistik"
              component={LogisticsScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {false && userInfo.isRecipientPartner && (
            <Tab.Screen
              name="Modtagelse"
              component={RecipientScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {false && userInfo.isProductionPartner && (
            <Tab.Screen
              name="Produktion"
              component={ProductionScreen}
              initialParams={{ userId: userInfo.userId }}
              options={{
                tabBarIcon: TabBarIcon,
              }}
            />
          )}
          {false && userInfo.userHasNoAccess && (
            <Tab.Screen name="NoAccess" component={NoAccess} />
          )}
        </Tab.Navigator>
      </GlobalSnackbarContext.Provider>
      <DismissableSnackbar globalSnackbarState={globalSnackbarState} />
    </SafeAreaProvider>
  ) : (
    <Text>No user info</Text>
  );
};

export default TabNavigator;
