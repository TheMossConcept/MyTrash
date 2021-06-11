import React, { FC } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Dialog, Portal } from "react-native-paper";

type Props = {
  title?: string;
  description?: string;
  showState: [boolean, (newValue: boolean) => void];
  actionToConfirm: () => void;
};

const ConfirmationDialog: FC<Props> = ({
  title = "Er du sikker?",
  description,
  showState,
  actionToConfirm,
}) => {
  const [isVisible, setIsVisible] = showState;

  const hideDialog = () => setIsVisible(false);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Title>{title}</Dialog.Title>
        {description ? (
          <Dialog.Content>
            <Text>{description}</Text>
          </Dialog.Content>
        ) : null}
        <Dialog.Actions>
          <View style={styles.actionButton}>
            <Button title="Ja" onPress={actionToConfirm} />
          </View>
          <View style={styles.actionButton}>
            <Button title="Nej" onPress={hideDialog} />
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    padding: 10,
  },
});

export default ConfirmationDialog;
