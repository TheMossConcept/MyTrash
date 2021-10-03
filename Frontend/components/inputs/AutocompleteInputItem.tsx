import React, { FC, useRef } from "react";
import { TouchableOpacity, Text, Keyboard, StyleSheet } from "react-native";
import globalStyles from "../../utils/globalStyles";
import { SelectableEntity } from "./AutocompleteInput";

type Props = {
  item: SelectableEntity;
  handleItemSelection: (item: SelectableEntity) => void;
};

const AutocompleteInputItem: FC<Props> = ({
  item,
  handleItemSelection: parentHandleItemSelection,
}) => {
  const ref = useRef<TouchableOpacity | null>(null);
  /*
  Keyboard.addListener("keyboardWillHide", (event) => {
    const touchEndCoordinatesX = event.endCoordinates.screenX;

    // Define these so we can add slack at some point if we need to
    const touchMinimumXBound = touchEndCoordinatesX;
    const touchMaximumXBound = touchEndCoordinatesX;

    const touchEndCoordinatesY = event.endCoordinates.screenY;
    const rectification = 100;
    const touchMinimumYBound = touchEndCoordinatesY - rectification;
    const touchMaximumYBound = touchEndCoordinatesY - rectification;

    ref.current?.measureInWindow((x, y, width, height) => {
      const xMinimumBound = x - width / 2;
      const xMaximumBound = x + width / 2;

      const yMinimumBound = y - height / 2;
      const yMaximumBound = y + height / 2;

      const isWithinXBounds =
        touchMinimumXBound >= xMinimumBound &&
        touchMaximumXBound <= xMaximumBound;

      const isWithinYBounds =
        touchMinimumYBound >= yMinimumBound &&
        touchMaximumYBound <= yMaximumBound;

      if (isWithinXBounds && isWithinYBounds) {
        parentHandleItemSelection(item);
      }
    });
  });
   */

  const handleItemSelection = (selectedItem: SelectableEntity) => () => {
    parentHandleItemSelection(selectedItem);
  };

  return (
    <TouchableOpacity
      ref={ref}
      onPress={handleItemSelection(item)}
      style={styles.touchableOpacity}
    >
      <Text style={[globalStyles.subheaderText, styles.itemText]}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    width: "100%",
  },
  itemText: { fontSize: 12, paddingVertical: 15 },
});

export default AutocompleteInputItem;
