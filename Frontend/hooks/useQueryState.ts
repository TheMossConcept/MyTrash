import { useEffect, useState } from "react";
import { SelectableEntity } from "../components/inputs/AutocompleteInput";

const useQueryState = (
  selectionState: [string, (newValue: string) => void],
  entities: SelectableEntity[]
): [string, (newValue: string) => void] => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = selectionState;

  // This useEffect ensures that the query is never different from the display
  // name of the selected entity when an entity is selected. It handle the case
  // where the query changes
  useEffect(() => {
    const selectedEntity = entities.find((entity) => entity.id === selectedId);
    if (selectedEntity && selectedEntity.displayName !== query) {
      setSelectedId("");
    }
    // NB! We ONLY want this to trigger on query changes, not selectedId changes
    // as its job is to reset the selection when the query is changed
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [entities, query]);

  // This useEffect enables query update when an entity is explicitly selected
  // as well as initialization from outside the component using this hook when
  // an entity is implicitly selected (query is local to the component using this hook!)
  useEffect(() => {
    const selectedEntity = entities.find((entity) => entity.id === selectedId);
    if (selectedEntity) {
      setQuery(selectedEntity.displayName);
    }
  }, [entities, selectedId]);

  return [query, setQuery];
};

export default useQueryState;
