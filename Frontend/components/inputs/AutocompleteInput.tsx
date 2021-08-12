import axios from "axios";
import { ErrorMessage, useFormikContext } from "formik";
import React, {
  FC,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { take } from "lodash";
import { EventRegister } from "react-native-event-listeners";
import { Text, View, ViewStyle, TextInput, StyleSheet } from "react-native";
import Autocomplete, {
  AutocompleteProps,
} from "react-native-autocomplete-input";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import useQueryState from "../../hooks/useQueryState";
import globalStyles from "../../utils/globalStyles";
import useOutsideClickDetector from "../../hooks/useOutsideClickDetector";

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
  const [entities, setEntities] = useState<SelectableEntity[]>([]);
  const [, setLoading] = useState(false);
  const [hideSuggestionList, setHideSuggestionList] = useState(true);

  const autocompleteRef = useRef(null);
  const clickOutsideHandler = () => {
    console.log("OUTSIDE CLICK!!");
    setHideSuggestionList(true);
  };
  useOutsideClickDetector(autocompleteRef, clickOutsideHandler);

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

    const [query, setQuery] = useQueryState(
      [selectedId, setSelectedId],
      entities
    );

    const filteredEntities = useMemo(() => {
      const entitiesMatchingQuery = entities.filter((entity) => {
        const lowerCaseDisplayName = entity.displayName.toLowerCase();
        const lowerCaseQuery = query.toLowerCase();

        return lowerCaseDisplayName.includes(lowerCaseQuery);
      });

      // Make sure the list never contains more than five entries
      return take(entitiesMatchingQuery, 5);
    }, [entities, query]);

    // ======================= Update of entries ==================================

    const sharedAxiosConfig = useAxiosConfig();

    const updateEntities = useCallback(() => {
      setLoading(true);

      axios
        .get(endpoint, {
          ...sharedAxiosConfig,
        })
        .then((entitiesResult) => {
          // TODO TODO TODO: Fix this once you implement pagination for all endpoints returning mor than one value
          const fetchedEntities: SelectableEntity[] =
            entitiesResult.data.value || entitiesResult.data;
          // There is no need to throw away the old data
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
          if (typeof updateEntitiesEventListener !== "boolean") {
            EventRegister.removeEventListener(updateEntitiesEventListener);
          }
        };
      }
      return () => {};
    }, [updateEntities, updateEntitiesEventName]);

    // ============================================================================

    const handleItemSelection = (item: SelectableEntity) => () => {
      setSelectedId(item.id);
      setHideSuggestionList(true);
    };

    // The types for react-native-autocomplete-input are faulty. It is flatListProps { renderItem } that is
    // required not renderItem on its own
    return (
      <View style={style} ref={autocompleteRef}>
        {selectedId ? (
          <Text style={[globalStyles.subheaderText, styles.labelText]}>
            {title}
          </Text>
        ) : null}
        <Autocomplete
          containerStyle={containerStyle}
          data={filteredEntities}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setHideSuggestionList(false)}
          onBlur={(event) => {
            if (handleBlur) {
              // We need to give the other event handler time to do its job before
              // hiding the suggestion list.
              // TODO: Do something less brittle that is not
              // reliant on timing! Then we can also pass handleBlur(key) directly as a callback!
              // setTimeout(() => setHideSuggestionList(true), 250);
              handleBlur(key)(event);
            }
          }}
          renderTextInput={({ value, onChangeText, onFocus, onBlur }: any) => (
            <TextInput
              value={value}
              onChangeText={onChangeText}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={title}
              placeholderTextColor="#a3a5a8"
              style={globalStyles.textField}
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
            ListEmptyComponent: EmptyComponent,
          }}
        />
        <ErrorMessage
          name={key}
          render={(errorMessage) => <Text>{errorMessage}</Text>}
        />
      </View>
    );
  }
};

const EmptyComponent: FC<{}> = () => {
  return (
    <Text style={{ height: 100, width: "100%" }}>
      Der er ingen brugere tilgængelige
    </Text>
  );
};

const styles = StyleSheet.create({
  labelText: { fontSize: 12 },
});

export default AutocompleteInput;
