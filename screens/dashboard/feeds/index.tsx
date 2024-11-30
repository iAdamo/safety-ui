import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getUnsafeZone } from "@/api/unsafeZoneHelper";
import getLocation from "@/hooks/GetLocation";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { FeedCardModal } from "@/components/modals/FeedCardModal";
import { OptionMenu } from "@/components/menu/OptionsMenu";
import { useSession } from "@/context/AuthContext";
import {
  Box,
  Text,
  VStack,
  SafeAreaView,
  Card,
  Heading,
} from "@/components/ui";

import { IUnsafeZoneResponse } from "@/components/componentTypes";

const Feeds = () => {
  const [feeds, setFeeds] = useState<IUnsafeZoneResponse[]>([]);
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );

  const { userData } = useSession();

  const [unsafeZones, setUnsafeZones] = useState([]);
  const {
    location,
    locationError,
    loading,
    requestLocationPermission,
    resetError,
  } = getLocation();
  const [showLocationError, setShowLocationError] = useState(false);

  const router = useRouter();

  // Show location error modal
  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
    }
  }, [locationError]);

  // Fetch unsafe zones
  useEffect(() => {
    const fetchUnsafeZones = async () => {
      try {
        const response = await getUnsafeZone(userData.id || "", {
          userLat: location?.latitude || 0,
          userLong: location?.longitude || 0,
          proximity: userData.proximity || 0,
        });
        if (response) {
          if (response.length === 0) {
            setFeeds([]);
          } else {
            setFeeds(response);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (userData.id && location) {
      fetchUnsafeZones();
      const intervalId = setInterval(fetchUnsafeZones, 300000); // Update every 5 minutes

      return () => clearInterval(intervalId); // Clear interval on component unmount
    } else {
      requestLocationPermission();
    }
  }, [userData.id, location]);

  const handleCardPress = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: true }));
  };

  const handleCloseModal = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: false }));
  };

  return (
    <Box className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={"#4682B4"} />
      <SafeAreaView className="h-40 bg-SteelBlue border-0 shadow-hard-5-indianred"></SafeAreaView>
      <VStack className="flex-1 p-5">
        <VStack className="h-full p-3">
          <ScrollView
            className="flex-col h-full pt-3"
            showsVerticalScrollIndicator={false}
          >
            {feeds.map((feed) => (
              <TouchableOpacity
                key={feed._id}
                onPress={() => handleCardPress(feed._id)}
              >
                <Card
                  variant="elevated"
                  className="mb-3 shadow-SteelBlue shadow-sm bg-primary"
                >
                  <Heading size="md" className="mb-1">
                    {feed.title}
                  </Heading>
                  <Text size="sm">{feed.description}</Text>
                </Card>
                <FeedCardModal
                  isOpen={modalVisible[feed._id]}
                  onClose={() => handleCloseModal(feed._id)}
                  feed={feed}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </VStack>
      </VStack>
      <VStack className="h-16 bg-SteelBlue border-0 shadow-hard-5-steelblue absolute bottom-0 w-full"></VStack>

      <OptionMenu />

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

export { Feeds };
