import { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LocationData } from "@/components/componentTypes";

const LOCATION_TASK_NAME = "background-location-task";

let setBgLocation: React.Dispatch<React.SetStateAction<LocationData | null>>;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background task error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const latestLocation = locations[0];
      if (setBgLocation) {
        setBgLocation({
          latitude: latestLocation.coords.latitude,
          longitude: latestLocation.coords.longitude,
        });
      }
    }
  }
});

export function useLocationAndBackgroundFetch() {
  const [bgLocation, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [backgroundStatus, requestBackgroundPermissions] =
    Location.useBackgroundPermissions();

  useEffect(() => {
    setBgLocation = setLocation;

    const startBackgroundLocationUpdates = async () => {
      try {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
          LOCATION_TASK_NAME
        );
        if (!hasStarted) {
          if (backgroundStatus?.status === "granted") {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
              accuracy: Location.Accuracy.BestForNavigation,
              timeInterval: 1000,
              distanceInterval: 5,
              foregroundService: {
                notificationTitle: "Safety Updates On",
                notificationBody:
                  "We are tracking your location in the background",
              },
            });
          }
        }
      } catch (error) {
        console.error("Error starting background location updates:", error);
        setError(error);
      }
    };

    startBackgroundLocationUpdates();
  }, [backgroundStatus]);

  const stopBackgroundLocationUpdates = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Background location tracking stopped");
    }
  };

  return { bgLocation, error, stopBackgroundLocationUpdates };
}
