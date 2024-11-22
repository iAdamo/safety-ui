import React, { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Box } from "@/components/ui";

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
}
export { MapScreen };
