import axios from "axios";
import { ErrorMessage, useFormikContext } from "formik";
import React, {
  FC,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { take } from "lodash";
import { EventRegister } from "react-native-event-listeners";
import {
  Text,
  View,
  ViewStyle,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import Autocomplete, {
  AutocompleteProps,
} from "react-native-autocomplete-input";
import { Divider } from "react-native-paper";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import useQueryState from "../../hooks/useQueryState";
import globalStyles from "../../utils/globalStyles";
import useOutsideClickDetector from "../../hooks/useOutsideClickDetector";
import LoadingIndicator from "../styled/LoadingIndicator";
import platform from "../../utils/platform";
import { ScrollViewContext } from "../styled/MainContentArea";

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
  editable?: boolean;
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
  editable = true,
  style,
}) => {
  const [entities, setEntities] = useState<SelectableEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [hideSuggestionList, setHideSuggestionList] = useState(true);

  const scrollViewRef = useContext(ScrollViewContext);

  const autocompleteRef = useRef(null);
  const clickOutsideHandler = () => {
    setHideSuggestionList(true);
    if (platform.platformName !== "web") {
      Keyboard.dismiss();
    }
  };
  useOutsideClickDetector(autocompleteRef, clickOutsideHandler);

  const formikProps = useFormikContext<any>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of select partners form. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, setFieldValue } = formikProps;

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
      Keyboard.dismiss();

      setSelectedId(item.id);
      setHideSuggestionList(true);
    };

    // The types for react-native-autocomplete-input are faulty. It is flatListProps { renderItem } that is
    // required not renderItem on its own
    return (
      <View style={style} ref={autocompleteRef}>
        <Text style={[globalStyles.subheaderText, styles.labelText]}>
          {title}
        </Text>
        <View>
          <Autocomplete
            containerStyle={containerStyle}
            data={filteredEntities}
            value={query}
            onChangeText={setQuery}
            onFocus={() => {
              if (editable) {
                setHideSuggestionList(false);
                if (scrollViewRef && scrollViewRef.current) {
                  scrollViewRef.current.scrollTo({ y: 100, animated: true });
                }
              }
            }}
            renderTextInput={({
              value,
              onChangeText,
              onFocus,
              onBlur,
            }: any) => (
              <TextInput
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={title}
                placeholderTextColor="#a3a5a8"
                editable={editable}
                style={globalStyles.textField}
              />
            )}
            hideResults={hideSuggestionList}
            flatListProps={{
              keyExtractor: (item: SelectableEntity) => item.id,
              ItemSeparatorComponent: Divider,
              keyboardShouldPersistTaps: "handled",
              // eslint-disable-next-line react/display-name
              renderItem: ({ item }: { item: SelectableEntity }) => {
                return (
                  <TouchableOpacity
                    onPress={handleItemSelection(item)}
                    style={styles.touchableOpacity}
                  >
                    <Text style={[globalStyles.subheaderText, styles.itemText]}>
                      {item.displayName}
                    </Text>
                  </TouchableOpacity>
                );
              },
            }}
          />
          {/* For some reason, the ListEmptyComponent is never rendered when passed in FlatlistProps so this is my workaround */}
          {!hideSuggestionList && filteredEntities.length === 0 && (
            <View style={styles.emptyViewContainer}>
              {loading ? (
                <LoadingIndicator />
              ) : (
                <Text style={[globalStyles.subheaderText, styles.itemText]}>
                  Listen er tom
                </Text>
              )}
            </View>
          )}
        </View>
        <ErrorMessage
          name={key}
          render={(errorMessage) => <Text>{errorMessage}</Text>}
        />
      </View>
    );
  }
};
const styles = StyleSheet.create({
  labelText: { fontSize: 12 },
  itemText: { fontSize: 12, paddingVertical: 15 },
  touchableOpacity: {
    width: "100%",
  },
  emptyViewContainer: {
    height: 45,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AutocompleteInput;
