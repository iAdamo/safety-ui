import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { useLocationAndUnsafeZones } from "@/hooks/useUnsafeZones";
import Loader from "@/components/loader";
import MyUnsafeZone from "@/components/MyUnsafeZone";
import { RightFeeds } from "@/components/fab/FeedsFab";
import UnsafeZones from "@/components/modals/unsafezone/UnsafeZones";
import {
  Box,
  VStack,
  SafeAreaView,
} from "@/components/ui";

const Feeds = () => {
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const {
    loadingZone,
    fetchUnsafeZones,
    loadingLocation,
    locationError,
    requestLocationPermission,
    resetError,
  } = useLocationAndUnsafeZones();
  const [showLocationError, setShowLocationError] = useState(false);
  const [showMyUnsafeZone, setShowMyUnsafeZone] = useState(false);

  useEffect(() => {
    fetchUnsafeZones();
  }, [fetchUnsafeZones]);

  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
    }
  }, [locationError]);

  //if (loadingLocation || loadingZone) {
    //return <Loader />;
  //}

  const handleCloseModal = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: false }));
  };

  return (
    <Box className="flex-1">
      <StatusBar style="auto" translucent={false} backgroundColor={"#4682B4"} />
      <SafeAreaView className="h-40 bg-SteelBlue border-0 shadow-hard-5-indianred"></SafeAreaView>
      <VStack className="flex-1 px-5 pb-16">
        {showMyUnsafeZone && <MyUnsafeZone />}
        {/** public unsafe zones */}
        <UnsafeZones />
      </VStack>
      <VStack className="h-16 bg-SteelBlue border-0 shadow-hard-5-steelblue absolute bottom-0 w-full"></VStack>
      {/**Right fab */}
      <RightFeeds myUnsafeZone={setShowMyUnsafeZone} />
      {/** Location error modal */}
      <AlertModal
        open={showLocationError}
        onClose={() => setShowLocationError(false)}
        headerText="Location Disabled"
        bodyText="Location services have been disabled. Please re-enable location services to continue using the app."
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
    </Box>
  );
};

export { Feeds };
