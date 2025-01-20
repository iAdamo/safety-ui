import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { useStorageState } from "@/utils/UseStorageState";
import { getUnsafeZone, getUserUnsafeZones } from "@/api/unsafeZoneHelper";
import { IUnsafeZoneResponse, LocationData } from "@/components/componentTypes";
import { useSession } from "@/context/AuthContext";

export function useLocationAndUnsafeZones() {
  const { userData } = useSession();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [[loadingZone, unsafeZones], setUnsafeZones] =
    useStorageState<IUnsafeZoneResponse[]>("unsafeZones");
  const [[loadingUserZones, userUnsafeZones], setUserUnsafeZones] =
    useStorageState<IUnsafeZoneResponse[]>("userUnsafeZones");

  const requestLocationPermission = async () => {
    setLoadingLocation(true);
    try {
      if (Platform.OS === "web") {
        // Browser Geolocation API
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by this browser.");
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLocationError(null);
            setLoadingLocation(false);
          },
          (error) => {
            const errorMessage =
              error.code === error.PERMISSION_DENIED
                ? "User denied the request for Geolocation."
                : error.code === error.POSITION_UNAVAILABLE
                ? "Location information is unavailable."
                : error.code === error.TIMEOUT
                ? "The request to get user location timed out."
                : "An unknown error occurred.";
            setLocationError(errorMessage);
            setLoadingLocation(false);
          }
        );
      } else {
        // React Native with expo-location
        const { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync();

        if (foregroundStatus !== "granted") {
          throw new Error("Foreground location permission not granted.");
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setLocationError(null);
        setLoadingLocation(false);
      }
    } catch (error) {
      setLocationError(String(error));
      setLoadingLocation(false);
    }
  };

  const fetchUserUnsafeZones = async () => {
    if (userData?.id) {
      try {
        const response = await getUserUnsafeZones(userData.id);
        if (response) setUserUnsafeZones(response);
      } catch (error) {
        console.error("Error fetching user unsafe zones:", error);
      }
    }
  };

  const fetchUnsafeZones = useCallback(async () => {
    if (userData?.id && location) {
      setLoadingLocation(true);
      try {
        const response = await getUnsafeZone(userData.id, {
          userLat: location.latitude,
          userLong: location.longitude,
          proximity: userData.proximity,
        });
        if (response) setUnsafeZones(response);
      } catch (error) {
        console.error("Error fetching unsafe zones:", error);
      } finally {
        setLoadingLocation(false);
      }
    }
  }, [userData?.id, location, setUnsafeZones]);

  const resetError = () => setLocationError(null);

  return {
    location,
    locationError,
    loadingLocation,
    unsafeZones,
    userUnsafeZones,
    loadingZone,
    fetchUnsafeZones,
    fetchUserUnsafeZones,
    requestLocationPermission,
    resetError,
  };
}
