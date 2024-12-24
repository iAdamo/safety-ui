import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, RefreshControl } from "react-native";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { useLocationAndUnsafeZones } from "@/hooks/useUnsafeZones";
import { ViewUnsafeModal } from "@/components/modals/unsafezone/ViewUnsafeModal";
import Loader from "@/components/loader";
import MyUnsafeZone from "@/components/modals/unsafezone/MyUnsafeZone";
import { RightFeeds } from "@/components/fab/FeedsFab";
import {
  Box,
  Text,
  VStack,
  SafeAreaView,
  Card,
  Heading,
  Divider,
  Pressable,
} from "@/components/ui";

const Feeds = () => {
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const {
    unsafeZones,
    loadingZone,
    fetchUnsafeZones,
    loadingLocation,
    locationError,
    requestLocationPermission,
    resetError,
  } = useLocationAndUnsafeZones();
  const [showLocationError, setShowLocationError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMyUnsafeZone, setShowMyUnsafeZone] = useState(false);

  useEffect(() => {
    fetchUnsafeZones();
  }, [fetchUnsafeZones]);

  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
    }
  }, [locationError]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUnsafeZones();
    setRefreshing(false);
  };

  //if (loadingLocation || loadingZone) {
  //return <Loader />;
  //}

  const handleCardPress = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: true }));
  };

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

        <VStack className="h-full p-3">
          <ScrollView
            className="flex-col h-full"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4682B4"]}
              />
            }
          >
            {unsafeZones &&
              unsafeZones.map((feed) => (
                <Pressable
                  key={feed._id}
                  onPress={() => handleCardPress(feed._id)}
                >
                  <Card variant="elevated" className="mb-3 shadow-lg">
                    <Divider
                      className={`mb-2 h-1 mx-56 -mt-3 ${
                        feed?.severityLevel === "high"
                          ? "bg-IndianRed"
                          : feed?.severityLevel === "medium"
                          ? "bg-Khaki"
                          : "bg-SteelBlue"
                      }`}
                    />

                    <Heading size="md" className="mb-1">
                      {feed.title}
                    </Heading>
                    <Text size="sm">{feed.description}</Text>
                  </Card>
                  <ViewUnsafeModal
                    isOpen={modalVisible[feed._id]}
                    onClose={() => handleCloseModal(feed._id)}
                    zone={feed}
                  />
                </Pressable>
              ))}
          </ScrollView>
        </VStack>
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
