import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import AuthorizationButton from "../components/AuthorizationButton";
import { RootStackParamList } from "../typings/types";

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
    // TODO: Save in async storage here such that we can get it again if we end up at the error page!
    navigation.navigate("Root", {
      accessToken: tokenResponse.accessToken,
      idToken: tokenResponse.idToken,
    });
  };
  return (
    <View style={styles.container}>
      <AuthorizationButton handleAuthorization={handleAuthorizationSuccess} />
    </View>
  );
};

export default LoginScreen;
