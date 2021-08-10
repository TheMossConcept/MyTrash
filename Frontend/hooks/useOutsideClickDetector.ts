import { MutableRefObject, useEffect } from "react";
import { GestureResponderEvent } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import platform from "../utils/platform";

// NB! Funtion taken from here: https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
function useOutsideClickDetector(
  ref: MutableRefObject<any | null>,
  handler: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: GestureResponderEvent) {
      if (
        ref.current &&
        // NB! This ONLY works on web!!
        platform.platformName === "web" &&
        !ref.current.contains(event.target)
      ) {
        handler();
      }
    }

    const handleGlobalPressEventListener = EventRegister.addEventListener(
      "globalPress",
      handleClickOutside
    );
    return () => {
      if (typeof handleGlobalPressEventListener !== "boolean") {
        EventRegister.removeEventListener(handleGlobalPressEventListener);
      }
    };
  }, [ref, handler]);
}

export default useOutsideClickDetector;
