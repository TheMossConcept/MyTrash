import React, { FC } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Dialog, Portal } from "react-native-paper";
import WebButton from "../styled/WebButton";

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

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const dialogWidth = 400;
  const dialogHeight = 200;

  const topOffset =
    global.window.pageYOffset + windowHeight / 2 - dialogHeight / 2;
  const leftOffset = windowWidth / 2 - dialogWidth / 2;

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={hideDialog}
        style={{
          position: "absolute",
          top: topOffset,
          left: leftOffset,
          width: dialogWidth,
          height: dialogHeight,
        }}
      >
        <Dialog.Title>{title}</Dialog.Title>
        {description ? (
          <Dialog.Content>
            <Text>{description}</Text>
          </Dialog.Content>
        ) : null}
        <Dialog.Actions>
          <View style={styles.actionButtonContainer}>
            <WebButton
              text="Ja"
              onPress={actionToConfirm}
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
            />
          </View>
          <View style={styles.actionButtonContainer}>
            <WebButton
              text="Nej"
              onPress={hideDialog}
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
            />
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  actionButtonContainer: {
    padding: 10,
  },
  actionButton: {
    borderRadius: 16,
    paddingBottom: 9,
    paddingTop: 13,
  },
  actionButtonText: {
    marginLeft: 0,
  },
});

export default ConfirmationDialog;
