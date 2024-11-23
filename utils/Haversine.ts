import { useRef } from "react";

type Coordinates = { latitude: number; longitude: number };

export const haversine = (coord1: Coordinates, coord2: Coordinates): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371000; // Earth radius in meters
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 *  Fetch only if user moved more than 100 meters
 * @param newCoords
 * @returns
 */
export const shouldFetchUnsafeZones = (newCoords: Coordinates): boolean => {
  const lastFetchedCoords = useRef<Coordinates>({ latitude: 0, longitude: 0 });

  const distance = haversine(lastFetchedCoords.current, newCoords);
  if (distance > 100) {
    lastFetchedCoords.current = newCoords;
    return true;
  }
  return false;
};
