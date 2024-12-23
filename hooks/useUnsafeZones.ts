import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { useStorageState } from "@/utils/UseStorageState";
import { getUnsafeZone } from "@/api/unsafeZoneHelper";
import { IUnsafeZoneResponse } from "@/components/componentTypes";
import { useSession } from "@/context/AuthContext";

type LocationData = {
  latitude: number;
  longitude: number;
} | null;

export function useLocationAndUnsafeZones() {
  const { userData } = useSession();
  const [location, setLocation] = useState<LocationData>(null);
  const [locationError, setError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [[loadingZone, unsafeZones], setUnsafeZones] =
    useStorageState<IUnsafeZoneResponse[]>("unsafeZones");

  const requestLocationPermission = async () => {
    setLoadingLocation(true);
    if (Platform.OS === "web") {
      // Browser Geolocation API
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoadingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
          setLoadingLocation(false);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get user location timed out.");
              break;
            default:
              setError("An unknown error occurred.");
          }
          setLoadingLocation(false);
        }
      );
    } else {
      // React Native with expo-location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("This app requires location access to function properly.");
          setLoadingLocation(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setError(null);
      } catch (error) {
        setError("Failed to get location. Please try again.");
      } finally {
        setLoadingLocation(false);
      }
    }
  };

  const fetchUnsafeZones = useCallback(async () => {
    if (userData.id && location) {
      setLoadingLocation(true);
      try {
        const response = await getUnsafeZone(userData.id, {
          userLat: location.latitude,
          userLong: location.longitude,
          proximity: userData.proximity,
        });
        if (response) {
          setUnsafeZones(response);
          setLoadingLocation(false);
        }
      } catch (error) {
        console.error("Error fetching unsafe zones:", error);
      }
    }
  }, [userData?.id, location, setUnsafeZones]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (location) {
      fetchUnsafeZones();
      const intervalId = setInterval(fetchUnsafeZones, 300000);
      return () => clearInterval(intervalId);
    }
  }, [location, fetchUnsafeZones]);

  const resetError = () => setError(null);

  return {
    location,
    locationError,
    loadingLocation,
    unsafeZones,
    loadingZone,
    fetchUnsafeZones,
    requestLocationPermission,
    resetError,
  };
}
