import axios from "axios";
import { FormikHandlers } from "formik";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import Autocomplete, {
  AutocompleteProps,
} from "react-native-autocomplete-input";
import { TextInput } from "react-native-paper";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import axiosUtils from "../../utils/axios";

export type SelectableEntity = {
  id: string;
  displayName: string;
};

type Props = {
  title?: string;
  endpoint: string;
  selectionState: [string | undefined, (newValue: string) => void];
} & Pick<AutocompleteProps<any>, "containerStyle"> &
  Partial<Pick<FormikHandlers, "handleBlur">>;

// TODO: By simply handing this component an endpoint that it calls itself, we make it
// more reuseable by offloading responsibility onto it, however, we also potentially
// make these fields much more chatty if there are many, since we have (potentially several)
// HTTP calls pr field (if we need to get more paginated results). Find a way to reduce that
// chattyness while keeping the responsibility of calling the endpoint and handling pagination
// in here!
const AutocompleteInput: FC<Props> = ({
  title,
  endpoint,
  selectionState,
  containerStyle,
  handleBlur,
}) => {
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState<SelectableEntity[]>([]);
  const [query, setQuery] = useState("");

  const [, setSelectedUserId] = selectionState;

  const setQueryWrapper = (newValue: string) => {
    // When you re-query, you automatically loose your selection
    setSelectedUserId("");
    setQuery(newValue);
  };

  const accessToken = useContext(AccessTokenContext);

  useEffect(() => {
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
  }, [endpoint, accessToken]);

  const [hideSuggestionList, setHideSuggestionList] = useState(true);

  const filteredUsers = entities.filter((entity) => {
    const lowerCaseDisplayName = entity.displayName.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();

    return lowerCaseDisplayName.includes(lowerCaseQuery);
  });

  const handleItemSelection = (item: SelectableEntity) => () => {
    setSelectedUserId(item.id);
    setQuery(item.displayName);

    setHideSuggestionList(true);
  };

  // The types for react-native-autocomplete-input are faulty. It is flatListProps { renderItem } that is
  // required not renderItem on its own
  return (
    <Autocomplete
      containerStyle={containerStyle}
      data={filteredUsers}
      value={query}
      onChangeText={setQueryWrapper}
      onFocus={() => setHideSuggestionList(false)}
      onBlur={(event) => {
        // We need to give the other event handler time to do its job before
        // hiding the suggestion list.
        // TODO: Do something less brittle that is not
        // reliant on timing!
        setTimeout(() => setHideSuggestionList(true), 250);
        if (handleBlur) {
          handleBlur(event);
        }
      }}
      renderTextInput={({ value, onChangeText, onFocus, onBlur }: any) => (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          label={title}
        />
      )}
      listStyle={{ position: "absolute" }}
      hideResults={hideSuggestionList}
      flatListProps={{
        // eslint-disable-next-line react/display-name
        renderItem: ({ item }: { item: SelectableEntity }) => {
          return (
            <Text onPress={handleItemSelection(item)}>{item.displayName}</Text>
          );
        },
        ListEmptyComponent: loading ? (
          <ActivityIndicator />
        ) : (
          <Text>Der er ingen brugere tilgængelige</Text>
        ),
      }}
    />
  );
};

export default AutocompleteInput;
