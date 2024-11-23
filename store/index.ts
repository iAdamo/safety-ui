import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { persistStore, persistReducer } from "redux-persist";

let storage;

// Dynamically select storage engine
if (typeof window !== "undefined") {
  // For web (localStorage)
  storage = require("redux-persist/lib/storage").default;
} else {
  // For mobile (AsyncStorage)
  storage = require("@react-native-async-storage/async-storage").default;
}

const persistConfig = {
  key: "auth",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
});

export const persistor = persistStore(store);
export default store;
