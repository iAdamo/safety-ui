import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import useLocation from "@/hooks/useLocation";
import { useSession } from "@/context/AuthContext";
import { Box, VStack, Text, Button, ButtonText } from "@/components/ui";
import { StyleSheet } from "react-native";
import { CreateUnsafeModal } from "@/components/modals/unsafezone/CreateUnsafeModal";
import { ViewUnsafeModal } from "@/components/modals/unsafezone/ViewUnsafeModal";

import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { useUnsafeZones } from "@/hooks/useUnsafeZones";

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
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const mapRef = useRef<MapView>(null);
  const { userData } = useSession();
  const { unsafeZones, fetchUnsafeZones } = useUnsafeZones();

  if (!location) {
    if (locationError) {
      setShowLocationError(true);
    }
    return null;
  }

  const handleZoneClick = (zone?: any) => {
    if (zone) {
      // View the zone
      setSelectedZone(zone);
      setShowViewModal(true);
    } else {
      // Edit the zone
      setShowEditModal(true);
    }
  };

  if (loading) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
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
            {unsafeZones &&
              unsafeZones.map((zone) => (
                <React.Fragment key={zone._id}>
                  <Circle
                    center={{
                      latitude: zone.location.coordinates[1],
                      longitude: zone.location.coordinates[0],
                    }}
                    radius={zone.radius}
                    strokeColor={
                      zone.severityLevel === "high"
                        ? "rgba(255,0,0,0.8)"
                        : zone.severityLevel === "medium"
                        ? "rgba(255,165,0,0.8)"
                        : "rgba(255,255,0,0.8)"
                    }
                    fillColor={
                      zone.severityLevel === "high"
                        ? "rgba(255,0,0,0.3)"
                        : zone.severityLevel === "medium"
                        ? "rgba(255,165,0,0.3)"
                        : "rgba(255,255,0,0.3)"
                    }
                  />
                  <Marker
                    coordinate={{
                      latitude: zone.location.coordinates[1],
                      longitude: zone.location.coordinates[0],
                    }}
                    onPress={() => handleZoneClick(zone)}
                  />
                </React.Fragment>
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
              onPointerDown={() => handleZoneClick()}
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
          <CreateUnsafeModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            location={location}
          />
          <ViewUnsafeModal
            isOpen={showViewModal}
            onClose={() => {
              setSelectedZone(null);
              setShowViewModal(false);
            }}
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
