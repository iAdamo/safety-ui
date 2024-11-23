import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getUnsafeZone } from "@/api/unsafeZoneHelper";
import getLocation from "@/hooks/GetLocation";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { useSelector } from "react-redux";
import {
  Box,
  Center,
  Text,
  VStack,
  HStack,
  SafeAreaView,
  Card,
  Heading,
  Button,
  ButtonIcon,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tooltip,
  TooltipContent,
  TooltipText,
} from "@/components/ui";
import {
  ArrowLeftIcon,
  PlusIcon,
  MapPinIcon,
  SettingsIcon,
} from "lucide-react-native";

const Feeds = () => {
  const [feeds, setFeeds] = useState<
    { id: number; title: string; body: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [unsafeZones, setUnsafeZones] = useState([]);
  const {
    location,
    locationError,
    loading,
    requestLocationPermission,
    resetError,
  } = getLocation();
  const [showLocationError, setShowLocationError] = useState(false);


  const authData = useSelector((state: any) => state.auth);

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
        const response = await getUnsafeZone(authData.userId || "", {
          userLat: location?.latitude || 0,
          userLong: location?.longitude || 0,
          proximity: authData?.proximity || 0,
        });
        if (response) {
          if (response.length === 0) {
            setFeeds([{ id: 0, title: "No unsafe zones", body: "" }]);
          } else {
            setFeeds(response);
          }
        }
      } catch (err) {
        setFeeds([(err as any).response.data.message]);
      }
    };

    if (authData.userId && location) {
      fetchUnsafeZones();
      const intervalId = setInterval(fetchUnsafeZones, 300000); // Update every 5 minutes

      return () => clearInterval(intervalId); // Clear interval on component unmount
    } else {
      requestLocationPermission();
    }
  }, [authData.userId, location]);

  const handleCardPress = (id: number) => {
    setModalVisible((prev) => ({ ...prev, [id]: true }));
  };

  const handleCloseModal = (id: number) => {
    setModalVisible((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Box className="flex-1">
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
                <Modal
                  isOpen={modalVisible[feed.id] || false}
                  onClose={() => handleCloseModal(feed.id)}
                  isKeyboardDismissable={true}
                  closeOnOverlayClick={true}
                  avoidKeyboard={true}
                >
                  <ModalBackdrop />
                  <ModalContent>
                    <ModalHeader className="flex-col items-start gap-0.5">
                      <Heading>{feed.title}</Heading>
                      <Text>{feed.body}</Text>
                      <ModalCloseButton
                        onPress={() => handleCloseModal(feed.id)}
                      />
                    </ModalHeader>
                    <ModalBody className="mb-4">
                      <Text>Additional content for {feed.title}</Text>
                    </ModalBody>
                    <ModalFooter className="flex-col items-start">
                      <Button
                        variant="solid"
                        className="w-full bg-SteelBlue data-[hover=true]:bg-SteelBlue-600 data-[active=true]:bg-SteelBlue-700"
                        onPress={() => handleCloseModal(feed.id)}
                      >
                        <ButtonText>Close</ButtonText>
                      </Button>
                      <HStack space="xs" className="items-center">
                        <Button
                          className="gap-1"
                          variant="link"
                          size="sm"
                          onPress={() => handleCloseModal(feed.id)}
                        >
                          <ButtonIcon as={ArrowLeftIcon} />
                          <ButtonText>Back</ButtonText>
                        </Button>
                      </HStack>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </VStack>
      </VStack>
      <VStack className="h-16 bg-SteelBlue border-0 shadow-hard-5-steelblue absolute bottom-0 w-full"></VStack>
      <Box className="absolute bottom-20 right-5">
        <VStack space="md">
          <Tooltip
            placement="left"
            trigger={(triggerProps) => (
              <Button
                className="w-16 h-16 rounded-full bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
                onPress={() => router.push("/auth/signup")}
                {...triggerProps}
              >
                <ButtonIcon as={PlusIcon} />
              </Button>
            )}
          >
            <TooltipContent className="bg-background-50 rounded-md">
              <Box className="p-2.5">
                <Text size="sm">Profile</Text>
              </Box>
            </TooltipContent>
          </Tooltip>
          <Tooltip
            placement="left"
            trigger={(triggerProps) => (
              <Button
                className="w-16 h-16 rounded-full bg-Khaki data-[hover=true]:bg-Khaki-600 data-[active=true]:bg-Khaki-700 shadow-hard-5"
                onPress={() => router.push("/auth/signup")}
                {...triggerProps}
              >
                <ButtonIcon as={SettingsIcon} />
              </Button>
            )}
          >
            <TooltipContent className="bg-background-50 rounded-md">
              <Box className="p-2.5">
                <Text size="sm">Settings</Text>
              </Box>
            </TooltipContent>
          </Tooltip>
          <Tooltip
            placement="left"
            trigger={(triggerProps) => {
              return (
                <Button
                  className="w-16 h-16 rounded-full bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
                  {...triggerProps}
                  onPress={() => router.push("/dashboard/map")}
                >
                  <ButtonIcon as={MapPinIcon} />
                </Button>
              );
            }}
          >
            <TooltipContent className="bg-background-50 rounded-md">
              <Box className="p-2.5">
                <Text size="sm">Mark Unsafe Zone</Text>
              </Box>
            </TooltipContent>
          </Tooltip>
        </VStack>
      </Box>
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
