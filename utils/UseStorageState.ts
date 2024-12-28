import { useEffect, useCallback, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (key === "unsafeZones" || key === "userUnsafeZones") {
      if (value == null) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } else {
      if (value == null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    }
  }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
  const [state, setState] = useAsyncState<T>();

  useEffect(() => {
    const fetchStorageItem = async () => {
      if (Platform.OS === "web") {
        try {
          if (typeof localStorage !== "undefined") {
            const value = localStorage.getItem(key);
            setState(value ? JSON.parse(value) : null);
          }
        } catch (e) {
          console.error("Local storage is unavailable:", e);
        }
      } else {
        let value;
        if (key === "unsafeZones" || key === "userUnsafeZones") {
          value = await AsyncStorage.getItem(key);
        } else {
          value = await SecureStore.getItemAsync(key);
        }
        setState(value ? JSON.parse(value) : null);
      }
    };

    fetchStorageItem();
  }, [key]);

  const setValue = useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value ? JSON.stringify(value) : null);
    },
    [key]
  );

  return [state, setValue];
}
