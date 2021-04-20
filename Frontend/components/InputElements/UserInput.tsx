import React, { FC, useState } from "react";
import { Text } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { TouchableOpacity } from "react-native-gesture-handler";

type User = {
  id: string;
  displayName: string;
};

export type Props = {
  title?: string;
  users: User[];
  selectionState: [string, (newValue: string) => void];
};

const UserInput: FC<Props> = ({ title, users, selectionState }) => {
  const [query, setQuery] = useState("");
  const [, setSelectedUserId] = selectionState;

  return (
    <Autocomplete
      data={users}
      value={query}
      placeholder={title}
      onChangeText={setQuery}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedUserId(item.id)}>
          <Text>{item.displayName}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default UserInput;
