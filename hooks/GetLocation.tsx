import { useState, useEffect } from "react";
import * as Location from "expo-location";

type LocationData = {
  latitude: number;
  longitude: number;
} | null;

const getLocation = (): {
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
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("This app requires location access to function properly.");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setError(null); // Reset locationError state
      setLoading(false);
    } catch (error) {
      setError("Failed to get location. Please try again.");
      setLoading(false);
    }
  };

  // Function to reset locationError
  const resetError = () => setError(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return { location, locationError, loading, requestLocationPermission, resetError };
};

export default getLocation;
