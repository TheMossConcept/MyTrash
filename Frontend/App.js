"use strict";
exports.__esModule = true;
require("react-native-gesture-handler");
var expo_status_bar_1 = require("expo-status-bar");
var react_1 = require("react");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var useCachedResources_1 = require("./hooks/useCachedResources");
var useColorScheme_1 = require("./hooks/useColorScheme");
var navigation_1 = require("./navigation");
function App() {
    var isLoadingComplete = useCachedResources_1["default"]();
    var colorScheme = useColorScheme_1["default"]();
    if (!isLoadingComplete) {
        return null;
    }
    return (<react_native_safe_area_context_1.SafeAreaProvider>
      <navigation_1["default"] colorScheme={colorScheme}/>
      <expo_status_bar_1.StatusBar />
    </react_native_safe_area_context_1.SafeAreaProvider>);
}
exports["default"] = App;
