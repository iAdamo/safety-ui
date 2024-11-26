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

const Feeds = () => {
  const [feeds, setFeeds] = useState<
    { id: number; title: string; body: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState<{ [key: number]: boolean }>(
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
            setFeeds([
              {
                id: 0,
                title: `Your proximity - ${userData.proximity} meters is looking safe`,
                body: "",
              },
            ]);
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

  const handleCardPress = (id: number) => {
    setModalVisible((prev) => ({ ...prev, [id]: true }));
  };

  const handleCloseModal = (id: number) => {
    setModalVisible((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Box className="flex-1">
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor={"#4682B4"}
      />
      <SafeAreaView className="h-40 bg-SteelBlue border-0 shadow-hard-5-indianred"></SafeAreaView>
      <VStack className="flex-1 p-5">
        <VStack className="h-full p-3">
          <ScrollView
            className="flex-col h-full pt-3"
            showsVerticalScrollIndicator={false}
          >
            {feeds.map((feed) => (
              <TouchableOpacity
                key={feed.id}
                onPress={() => handleCardPress(feed.id)}
              >
                <Card
                  variant="elevated"
                  className="mx-10 mb-3 shadow-hard-5 bg-primary"
                >
                  <Heading size="md" className="mb-1">
                    {feed.title}
                  </Heading>
                  <Text size="sm">{feed.body}</Text>
                </Card>
                <FeedCardModal
                  isOpen={modalVisible[feed.id]}
                  onClose={() => handleCloseModal(feed.id)}
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
