import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { Button, StyleSheet, View } from "react-native";
import { AZURE_AD_CLIENT_ID } from "react-native-dotenv";
import AuthorizationButton from "../components/AuthorizationButton";
import useAzureAdFlows from "../hooks/useAzureAdFlows";
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

  const scopes = [AZURE_AD_CLIENT_ID];
  const resetPassword = useAzureAdFlows("B2C_1_PasswordReset", scopes);
  const onResetPasswordPress = () => resetPassword();

  return (
    <View style={styles.container}>
      <AuthorizationButton handleAuthorization={handleAuthorizationSuccess} />
      <Button title="NULSTIL KODEORD" onPress={onResetPasswordPress} />
    </View>
  );
};

export default LoginScreen;
