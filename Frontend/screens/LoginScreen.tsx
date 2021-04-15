import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import AuthorizationButton from "../components/AuthorizationButton";
import { RootStackParamList } from "../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

type Props = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: FC<Props> = ({ navigation }) => {
  const handleAuthorizationSuccess = (tokenResponse: any) => {
    // TODO: Add validation and proper typings here!
    sessionStorage.setItem("accessToken", tokenResponse.accessToken);

    navigation.navigate("Root");
  };
  return (
    <View style={styles.container}>
      <AuthorizationButton handleAuthorization={handleAuthorizationSuccess} />
    </View>
  );
};

export default LoginScreen;
