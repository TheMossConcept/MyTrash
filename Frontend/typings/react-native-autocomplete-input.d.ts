// TODO: Fix typings and make a PR on the definitelyTyped repo.
// These typings come from @types/react-native-autocomplete-input, however, since the community
// typings are hopelessly outdated I have decided to correct them myself.
declare module "react-native-autocomplete-input" {
  import { Component, ReactNode } from "react";
  import {
    GestureResponderHandlers,
    ListViewProperties,
    StyleProp,
    TextInputProperties,
    ViewStyle,
    FlatListProps,
  } from "react-native";

  export interface AutocompleteProps<T> extends TextInputProperties {
    /**
     * style
     * These styles will be applied to the container which surrounds the autocomplete component.
     */
    containerStyle?: StyleProp<ViewStyle>;

    /**
     * bool
     * Set to true to hide the suggestion list.
     */
    hideResults?: boolean;

    /**
     * array
     * An array with suggestion items to be rendered in renderItem({ item, index }). Any array with length > 0 will open the suggestion list and any array with length < 1 will hide the list.
     */
    data: T[];

    /**
     * object
     * Props to pass on to the underlying FlatList.
     */
    flatListProps?: Partial<FlatListProps<T>>;

    /**
     * style
     * These styles will be applied to the container which surrounds the textInput component.
     */
    inputContainerStyle?: StyleProp<ViewStyle>;

    /**
     * function
     * keyExtractor will be called to get key for each item. It's up to you which string to return as a key.
     */
    keyExtractor?(item: T, i: number): string;

    /**
     * style
     * These styles will be applied to the container which surrounds the result list.
     */
    listContainerStyle?: StyleProp<ViewStyle>;

    /**
     * style
     * These style will be applied to the result list.
     */
    listStyle?: StyleProp<ViewStyle>;

    /**
     * function
     * onShowResult will be called when the autocomplete suggestions appear or disappear.
     */
    onShowResult?(showResults: boolean): void;

    /**
     * function
     * onStartShouldSetResponderCapture will be passed to the result list view container (onStartShouldSetResponderCapture).
     */
    onStartShouldSetResponderCapture?: GestureResponderHandlers["onStartShouldSetResponderCapture"];

    /**
     * function
     * renderSeparator will be called to render the list separators which will be displayed between the list elements in the result view below the text input.
     */
    renderSeparator?: ListViewProperties["renderSeparator"];

    /**
     * function
     * render custom TextInput. All props passed to this function.
     */
    renderTextInput?(props: TextInputProperties): ReactNode;
  }

  // eslint-disable-next-line react/prefer-stateless-function
  export default class Autocomplete<T> extends Component<
    AutocompleteProps<T>
  > {}
}
