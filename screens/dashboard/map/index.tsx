import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import useLocation from "@/hooks/GetLocation";
import { useSession } from "@/context/AuthContext";
import { Box, VStack, HStack, Text, Button, ButtonText } from "@/components/ui";
import { StyleSheet } from "react-native";

const MapScreen = () => {
  const {
    location,
    locationError,
    loading,
    requestLocationPermission,
    resetError,
  } = useLocation();
  const [showLocationError, setShowLocationError] = useState(false);
  const { userData } = useSession();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
    }
  }, [locationError]);

  const centerMapOnUser = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  if (loading) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </VStack>
    );
  }

  if (showLocationError) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Text>{locationError}</Text>
        <Button onPress={requestLocationPermission}>
          <ButtonText>Retry</ButtonText>
        </Button>
      </VStack>
    );
  }

  return (
    <Box className="flex-1">
      {location && (
        <>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            />
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={userData.proximity} // Proximity range in meters
              strokeColor="rgba(0,150,255,0.5)" // Border color of the circle
              fillColor="rgba(0,150,255,0.2)" // Fill color with transparency
              strokeWidth={2} // Border width
            />
          </MapView>
        </>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export { MapScreen };
