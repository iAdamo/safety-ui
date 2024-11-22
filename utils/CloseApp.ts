import { Alert, Platform, BackHandler } from "react-native";

/**
 * Function to close the app
 */
export const closeApp = () => {
  if (Platform.OS === "android") {
    BackHandler.exitApp();
  } else {
    Alert.alert(
      "Exit App",
      "Please close the app manually.",
      [{ text: "OK" }],
      { cancelable: false }
    );
  }
};
