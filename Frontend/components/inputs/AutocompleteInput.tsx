import axios from "axios";
import { ErrorMessage, useFormikContext } from "formik";
import React, { FC, useEffect, useMemo, useState, useCallback } from "react";
import { EventRegister } from "react-native-event-listeners";
import { ActivityIndicator, Text, View, ViewStyle } from "react-native";
import Autocomplete, {
  AutocompleteProps,
} from "react-native-autocomplete-input";
import { TextInput } from "react-native-paper";
import useAxiosConfig from "../../hooks/useAxiosConfig";

export type SelectableEntity = {
  id: string;
  displayName: string;
};

type Props = {
  endpoint: string;
  formKey: string;
  updateEntitiesEventName?: string;
  title?: string;
  style?: ViewStyle;
} & Pick<AutocompleteProps<any>, "containerStyle">;

// TODO: By simply handing this component an endpoint that it calls itself, we make it
// more reuseable by offloading responsibility onto it, however, we also potentially
// make these fields much more chatty if there are many, since we have (potentially several)
// HTTP calls pr field (if we need to get more paginated results). Find a way to reduce that
// chattyness while keeping the responsibility of calling the endpoint and handling pagination
// in here!
const AutocompleteInput: FC<Props> = ({
  title,
  endpoint,
  containerStyle,
  updateEntitiesEventName,
  formKey: key,
  style,
}) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [entities, setEntities] = useState<SelectableEntity[]>([]);

  const filteredEntities = useMemo(
    () =>
      entities.filter((entity) => {
        const lowerCaseDisplayName = entity.displayName.toLowerCase();
        const lowerCaseQuery = query.toLowerCase();

        return lowerCaseDisplayName.includes(lowerCaseQuery);
      }),
    [entities, query]
  );

  const formikProps = useFormikContext<any>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of select partners form. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, setFieldValue, handleBlur } = formikProps;

    const selectedId = values[key];
    const setSelectedId = (newValue: any) => {
      setFieldValue(key, newValue);
    };

    // ================ UI and selection state consistency ========================

    // This useEffect ensures correct query state on selection both when it happens explicitly
    // in the component and explicitly from the outside
    useEffect(() => {
      // TODO: This is going to be a problem, once we introduce pagination!
      filteredEntities.forEach((entity) => {
        if (entity.id === selectedId) {
          setQuery(entity.displayName);
        }
      });
    }, [filteredEntities, selectedId]);

    // This useEffect enables reset from outside this component (query is local to  this component!)
    useEffect(() => {
      if (!selectedId) {
        setQuery("");
      }
    }, [selectedId]);

    // Always reset selection state when changing the query!
    const setQueryWrapper = (newValue: string) => {
      // When you re-query, you automatically loose your selection
      setSelectedId("");
      setQuery(newValue);
    };

    // ============================================================================

    const sharedAxiosConfig = useAxiosConfig();

    const updateEntities = useCallback(() => {
      setLoading(true);

      axios
        .get(endpoint, {
          ...sharedAxiosConfig,
        })
        .then((entitiesResult) => {
          const fetchedEntities: SelectableEntity[] = entitiesResult.data;
          setEntities(fetchedEntities);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [endpoint, sharedAxiosConfig]);

    useEffect(() => {
      // Initialize
      updateEntities();

      // Update on event
      if (updateEntitiesEventName) {
        // Update when a new partner is added
        // TODO: Find types for this library and make sure all the events are strongly typed!!
        const updateEntitiesEventListener = EventRegister.addEventListener(
          updateEntitiesEventName,
          () => {
            updateEntities();
          }
        );

        // Remember to cleanup or you will live in a dirty codebase full of memory leaks!
        return () => {
          if (
            updateEntitiesEventListener !== false &&
            updateEntitiesEventListener !== true
          ) {
            EventRegister.removeEventListener(updateEntitiesEventListener);
          }
        };
      }
      return () => {};
    }, [updateEntities, updateEntitiesEventName]);

    const [hideSuggestionList, setHideSuggestionList] = useState(true);

    const handleItemSelection = (item: SelectableEntity) => () => {
      setSelectedId(item.id);
      setQuery(item.displayName);

      setHideSuggestionList(true);
    };

    // The types for react-native-autocomplete-input are faulty. It is flatListProps { renderItem } that is
    // required not renderItem on its own
    return (
      <View style={style}>
        <Autocomplete
          containerStyle={containerStyle}
          data={filteredEntities}
          value={query}
          onChangeText={setQueryWrapper}
          onFocus={() => setHideSuggestionList(false)}
          onBlur={(event) => {
            // We need to give the other event handler time to do its job before
            // hiding the suggestion list.
            // TODO: Do something less brittle that is not
            // reliant on timing! Then we can also pass handleBlur(key) directly as a callback!
            setTimeout(() => setHideSuggestionList(true), 250);
            if (handleBlur) {
              handleBlur(key)(event);
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
                <Text onPress={handleItemSelection(item)}>
                  {item.displayName}
                </Text>
              );
            },
            ListEmptyComponent: loading ? (
              <ActivityIndicator />
            ) : (
              <Text>Der er ingen brugere tilgængelige</Text>
            ),
          }}
        />
        <ErrorMessage name={key} />
      </View>
    );
  }
};

export default AutocompleteInput;
