import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";

type LocationData = {
  latitude: number;
  longitude: number;
} | null;

const useLocation = (): {
  location: LocationData;
  locationError: string | null;
  loading: boolean;
  requestLocationPermission: () => Promise<void>;
  resetError: () => void;
} => {
  const [location, setLocation] = useState<LocationData>(null);
  const [locationError, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    setLoading(true);
    if (Platform.OS === "web") {
      // Browser Geolocation API
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
          setLoading(false);
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
          setLoading(false);
        }
      );
    } else {
      // React Native with expo-location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("This app requires location access to function properly.");
          setLoading(false);
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
        setLoading(false);
      }
    }
  };

  const resetError = () => setError(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return {
    location,
    locationError,
    loading,
    requestLocationPermission,
    resetError,
  };
};

export default useLocation;
