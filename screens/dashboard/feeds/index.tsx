import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { useLocationAndUnsafeZones } from "@/hooks/useUnsafeZones";
import Loader from "@/components/loader";
import MyUnsafeZone from "@/components/MyUnsafeZone";
import UnsafeZones from "@/components/UnsafeZones";
import { useRouter } from "expo-router";
import { useSignOut } from "@/hooks/useSignOut";
import { CreateUnsafeModal } from "@/components/modals/unsafezone/CreateUnsafeModal";
import * as Location from "expo-location";
import { locationStateManager } from "@/utils/LocationStateManager";
import { useLocationAndBackgroundFetch } from "@/hooks/bgLocationManager";
import { RightFabs } from "./RightFabs";
import {
  PlusIcon,
  MapPinIcon,
  SettingsIcon,
  PanelTopOpenIcon,
} from "lucide-react-native";
import {
  Text,
  SafeAreaView,
  Box,
  VStack,
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
  Badge,
  BadgeText,
  Fab,
  FabIcon,
} from "@/components/ui";

const Feeds = () => {
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [backgroundStatus] = Location.useBackgroundPermissions();
  const {
    location: fgLocation,
    loadingZone,
    fetchUnsafeZones,
    loadingLocation,
    locationError,
    requestLocationPermission,
    resetError,
  } = useLocationAndUnsafeZones();
  const [showLocationError, setShowLocationError] = useState(false);
  const [showMyUnsafeZone, setShowMyUnsafeZone] = useState(false);
  const [location, setLocation] = useState(locationStateManager.getLocation());

  useEffect(() => {
    const unsubscribe = locationStateManager.subscribe(setLocation);
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [backgroundStatus]);

  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
    } else if (location) {
      setShowLocationError(false);
    }
  }, [locationError]);

  useEffect(() => {
    fetchUnsafeZones();
  }, [fetchUnsafeZones, fgLocation, location]);

  const handleCloseModal = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: false }));
  };

  const signOut = useSignOut();
  const router = useRouter();

  return (
    <VStack className="flex-1">
      {!fgLocation && !location ? (
        <Loader />
      ) : (
        <Box className="flex-1">
          <StatusBar
            style="auto"
            translucent={false}
            backgroundColor={"#4682B4"}
          />
          <SafeAreaView className="h-40 bg-SteelBlue border-0 shadow-hard-5-indianred"></SafeAreaView>
          <VStack className="flex-1 px-5 bg-red-200 pb-16">
            <Text>
              {location?.latitude} {location?.longitude}
            </Text>
            {/** my unsafe zone */}
            {showMyUnsafeZone && <MyUnsafeZone />}
            {/** public unsafe zones */}
            <UnsafeZones />
          </VStack>
          <VStack className="h-16 bg-SteelBlue border-0 shadow-hard-5-steelblue absolute bottom-0 w-full"></VStack>
          <RightFabs
            myUnsafeZone={setShowMyUnsafeZone}
            location={fgLocation || location}
          />
        </Box>
      )}
      {/** Location error modal */}
      <AlertModal
        open={showLocationError}
        onClose={() => setShowLocationError(false)}
        headerText="Location Disabled"
        bodyText="Location services have been disabled. Please re-enable location services to continue using the app. Enable location and try again."
        buttonOnePress={() => {
          setShowLocationError(false);
          resetError();
          requestLocationPermission();
        }}
        buttonTwoPress={() => {
          setShowLocationError(false);
          closeApp();
        }}
      />
    </VStack>
  );
};

export { Feeds };
