import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import useLocation from "@/hooks/GetLocation";
import { useSession } from "@/context/AuthContext";
import { Box, VStack, Text, Button, ButtonText } from "@/components/ui";
import { StyleSheet } from "react-native";
import { UnsafeZoneModal } from "@/components/modals/UnsafeZoneModal";
import { createUnsafeZone, getUnsafeZone } from "@/api/unsafeZoneHelper";
import { UnsafeZoneSchemaType } from "@/components/forms/schemas/UnsafeZoneSchema";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";

const MapScreen = () => {
  const {
    location,
    locationError,
    resetError,
    loading,
    requestLocationPermission,
  } = useLocation();
  const [showLocationError, setShowLocationError] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const mapRef = useRef<MapView>(null);
  const { userData } = useSession();
  const [unsafeZones, setUnsafeZones] = useState<any[]>([]);

  // Fetch unsafe zones
  useEffect(() => {
    if (locationError) setShowLocationError(true);

    const fetchUnsafeZones = async () => {
      try {
        if (!location) return;
        const response = await getUnsafeZone(userData.id, {
          userLat: location.latitude,
          userLong: location.longitude,
          proximity: userData.proximity,
        });
        if (response) setUnsafeZones(response);
      } catch (error) {
        console.error("Error fetching unsafe zones:", error);
      }
    };

    fetchUnsafeZones();
  }, [location, locationError]);

  const handleZoneClick = (zone?: any) => {
    if (!zone) {
      setShowEditModal(true);
    } else if (zone.markedBy === userData.id) {
      setSelectedZone(zone);
      setShowViewModal(true);
    }
  };

  const onSubmit = async (data: UnsafeZoneSchemaType) => {
    try {
      const {
        title,
        description,
        proximity,
        severity,
        tags,
        image,
        video,
        audio,
      } = data;
      const unsafeZoneData = {
        markedBy: userData.id,
        locations: {
          type: "Point",
          coordinates: [location?.longitude, location?.latitude],
        },
        radius: proximity,
        severityLevel: severity.toLowerCase(),
        title: title.toUpperCase(),
        description: description.trim(),
        tags,
        image,
        video,
        audio,
        resolved: false,
        active: true,
      };
      const response = await createUnsafeZone(unsafeZoneData);
      if (response) {
        setUnsafeZones((prevZones) => [...prevZones, response]);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error creating unsafe zone:", error);
    }
    setSelectedZone(null);
    setShowViewModal(false);
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
            showsUserLocation
          >
            {unsafeZones.map((zone) => (
              <>
                <Circle
                  key={zone.id}
                  center={{
                    latitude: zone.latitude,
                    longitude: zone.longitude,
                  }}
                  radius={zone.radius}
                  strokeColor={
                    zone.criticalLevel === "high"
                      ? "rgba(255,0,0,0.8)"
                      : zone.criticalLevel === "medium"
                      ? "rgba(255,165,0,0.8)"
                      : "rgba(255,255,0,0.8)"
                  }
                  fillColor={
                    zone.criticalLevel === "high"
                      ? "rgba(255,0,0,0.3)"
                      : zone.criticalLevel === "medium"
                      ? "rgba(255,165,0,0.3)"
                      : "rgba(255,255,0,0.3)"
                  }
                />
                <Marker
                  coordinate={{
                    latitude: zone.latitude,
                    longitude: zone.longitude,
                  }}
                  onPress={() => handleZoneClick(zone)}
                />
              </>
            ))}
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
              onPress={() => handleZoneClick()}
            />
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={userData.proximity}
              strokeColor="rgba(0,150,255,0.5)"
              fillColor="rgba(0,150,255,0.2)"
              strokeWidth={2}
            />
          </MapView>
          <UnsafeZoneModal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            onSubmit={onSubmit}
            zone={selectedZone}
          />
        </>
      )}

      {/** Location error modal */}
      <AlertModal
        open={showLocationError}
        onClose={() => setShowLocationError(false)}
        headerText="Location Disabled"
        bodyText="Location services have been disabled. Please re-enable location services to continue using the app."
        buttonOnePress={() => {
          setShowLocationError(false);
          resetError(); // Clear error before retrying
          requestLocationPermission();
        }}
        buttonTwoPress={() => {
          setShowLocationError(false);
          closeApp();
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export { MapScreen };
