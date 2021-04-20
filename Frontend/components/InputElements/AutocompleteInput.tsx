import React, { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";

export type SelectableEntity = {
  id: string;
  displayName: string;
};

type Props = {
  title?: string;
  entities: SelectableEntity[];
  selectionState: [string, (newValue: string) => void];
};

const AutocompleteInput: FC<Props> = ({ title, entities, selectionState }) => {
  const [query, setQuery] = useState("");
  const [, setSelectedUserId] = selectionState;

  const [hideSuggestionList, setHideSuggestionList] = useState(false);
  // Whenever we edit the query once more, show the suggestion list again
  useEffect(() => {
    setHideSuggestionList(
      entities.some((entity) => entity.displayName === query)
    );
  }, [query, entities]);

  const filteredUsers = entities.filter((entity) => {
    const lowerCaseDisplayName = entity.displayName.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();

    return lowerCaseDisplayName.includes(lowerCaseQuery);
  });

  // The types for react-native-autocomplete-input are faulty. It is flatListProps { renderItem } that is
  // required not renderItem on its own
  return (
    <View>
      <Text>{title}</Text>
      <Autocomplete
        data={filteredUsers}
        value={query}
        onChangeText={setQuery}
        hideResults={hideSuggestionList}
        flatListProps={{
          // eslint-disable-next-line react/display-name
          renderItem: ({ item }: { item: SelectableEntity }) => {
            const onItemPress = () => {
              setSelectedUserId(item.id);
              setQuery(item.displayName);

              setHideSuggestionList(true);
            };
            return <Text onPress={onItemPress}>{item.displayName}</Text>;
          },
        }}
      />
    </View>
  );
};

export default AutocompleteInput;
