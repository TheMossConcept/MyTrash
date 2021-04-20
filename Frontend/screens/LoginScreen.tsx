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
  // TODO: Add proper validation and typings here
  const handleAuthorizationSuccess = (tokenResponse: any) => {
    navigation.navigate("Root", { accessToken: tokenResponse.accessToken });
  };
  return (
    <View style={styles.container}>
      <AuthorizationButton handleAuthorization={handleAuthorizationSuccess} />
    </View>
  );
};

export default LoginScreen;
