import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";

export type SelectableEntity = {
  id: string;
  displayName: string;
};

type Props = {
  title?: string;
  endpoint: string;
  selectionState: [string, (newValue: string) => void];
};

// TODO: By simply handing this component an endpoint that it calls itself, we make it
// more reuseable by offloading responsibility onto it, however, we also potentially
// make these fields much more chatty if there are many, since we have (potentially several)
// HTTP calls pr field (if we need to get more paginated results). Find a way to reduce that
// chattyness while keeping the responsibility of calling the endpoint and handling pagination
// in here!
const AutocompleteInput: FC<Props> = ({ title, endpoint, selectionState }) => {
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<SelectableEntity[]>([]);
  const [query, setQuery] = useState("");
  const [, setSelectedUserId] = selectionState;

  const accessToken = useContext(AccessTokenContext);

  useEffect(() => {
    if (accessToken) {
      setLoading(true);

      axios
        .get(endpoint, {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((entitiesResult) => {
          const fetchedEntities: SelectableEntity[] = entitiesResult.data;
          setEntities(fetchedEntities);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [endpoint, accessToken]);

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
          ListEmptyComponent: loading ? (
            <ActivityIndicator />
          ) : (
            <Text>Der er ingen brugere tilgængelige</Text>
          ),
        }}
      />
    </View>
  );
};

export default AutocompleteInput;
