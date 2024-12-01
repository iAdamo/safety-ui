import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { OptionMenu } from "@/components/menu/OptionsMenu";
import { useUnsafeZones } from "@/hooks/useUnsafeZones";
import useLocation from "@/hooks/useLocation";
import { ViewUnsafeModal } from "@/components/modals/unsafezone/ViewUnsafeModal";
import {
  Box,
  Text,
  VStack,
  SafeAreaView,
  Card,
  Heading,
} from "@/components/ui";

const Feeds = () => {
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { unsafeZones, loading, fetchUnsafeZones } = useUnsafeZones();
  const { locationError, requestLocationPermission, resetError } =
    useLocation();
  const [showLocationError, setShowLocationError] = useState(false);

  const router = useRouter();

  // Show location error modal
  useEffect(() => {
    if (locationError) {
      setShowLocationError(true);
    }
  }, [locationError]);

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
            {unsafeZones &&
              unsafeZones.map((feed) => (
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
                  <ViewUnsafeModal
                    isOpen={modalVisible[feed._id]}
                    onClose={() => handleCloseModal(feed._id)}
                    zone={feed}
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
