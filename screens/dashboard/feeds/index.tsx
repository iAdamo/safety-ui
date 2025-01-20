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
import { LocationPermissionsWithPolicy } from "./LocationPolicy";
import {
  PlusIcon,
  MapPinIcon,
  SettingsIcon,
  PanelTopOpenIcon,
} from "lucide-react-native";
import {
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

  const {
    location,
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
    if (locationError) {
      setShowLocationError(true);
    } else if (location) {
      setShowLocationError(false);
    } else {
      requestLocationPermission();
    }
  }, [locationError]);

  useEffect(() => {
    fetchUnsafeZones();
  }, [fetchUnsafeZones]);

  const handleCloseModal = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: false }));
  };

  const signOut = useSignOut();
  const router = useRouter();

  const toggleMyUnsafeZone = async () => {
    setShowMyUnsafeZone((prev: boolean) => !prev);
  };

  return (
    <>
      {!location ? (
        <Loader />
      ) : (
        <Box className="flex-1">
          <StatusBar
            style="auto"
            translucent={false}
            backgroundColor={"#4682B4"}
          />
          <SafeAreaView className="h-40 bg-SteelBlue border-0 shadow-hard-5-indianred"></SafeAreaView>
          <VStack className="flex-1 px-5 pb-16">
            {showMyUnsafeZone && <MyUnsafeZone />}
            {/** public unsafe zones */}
            <UnsafeZones />
          </VStack>
          <VStack className="h-16 bg-SteelBlue border-0 shadow-hard-5-steelblue absolute bottom-0 w-full"></VStack>
          {/** Location permissions */}
          {/**Right fab */}
          <Box>
            <VStack className="absolute bottom-20 -right-2 gap-20">
              <Box>
                <Fab
                  className="w-16 h-16 rounded-full bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700 shadow-hard-5"
                  placement="bottom right"
                  onPress={toggleMyUnsafeZone}
                >
                  <FabIcon as={PanelTopOpenIcon} />
                </Fab>
              </Box>
              <Box>
                <Fab
                  className="w-16 h-16 rounded-full bg-yellow-500 data-[hover=true]:bg-yellow-200 data-[active=true]:bg-yellow-300 shadow-hard-5"
                  placement="bottom right"
                  onPress={() => router.push("/dashboard/map")}
                >
                  <FabIcon as={MapPinIcon} />
                </Fab>
              </Box>
              <Box>
                <Fab
                  className="w-16 h-16 rounded-full bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700 shadow-hard-5"
                  placement="bottom right"
                  onPress={() => setShowEditModal(true)}
                >
                  <FabIcon as={PlusIcon} />
                </Fab>
              </Box>
              <Box>
                <Menu
                  offset={5}
                  placement="top"
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Fab
                        className="w-16 h-16 rounded-full bg-primary-950 data-[hover=true]:bg-primary-200 data-[active=true]:bg-primary-500 shadow-hard-5"
                        placement="bottom right"
                        {...triggerProps}
                      >
                        <FabIcon as={SettingsIcon} />
                      </Fab>
                    );
                  }}
                >
                  <MenuItem
                    key="Membership"
                    textValue="Membership"
                    className="p-2 justify-between"
                  >
                    <MenuItemLabel size="sm">Membership</MenuItemLabel>
                    <Badge action="success" className="rounded-full">
                      <BadgeText className="text-2xs capitalize">Pro</BadgeText>
                    </Badge>
                  </MenuItem>
                  <MenuItem key="Orders" textValue="Orders" className="p-2">
                    <MenuItemLabel size="sm">Orders</MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="Address Book"
                    textValue="Address Book"
                    className="p-2"
                  >
                    <MenuItemLabel size="sm">Address Book</MenuItemLabel>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    key="Earn & Redeem"
                    textValue="Earn & Redeem"
                    className="p-2"
                  >
                    <MenuItemLabel size="sm">Earn & Redeem</MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="Help Center"
                    textValue="Help Center"
                    className="p-2"
                  >
                    <MenuItemLabel size="sm">Help Center</MenuItemLabel>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem
                    key="Logout"
                    textValue="Logout"
                    className="p-2"
                    onPress={() => {
                      signOut();
                      router.push("/auth/signin");
                    }}
                  >
                    <MenuItemLabel size="sm">Logout</MenuItemLabel>
                  </MenuItem>
                </Menu>
              </Box>
            </VStack>
            {/** Create an unsafe zone */}
            {location && (
              <CreateUnsafeModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                location={location}
              />
            )}
          </Box>
        </Box>
      )}
      {/** Location error modal */}
      <AlertModal
        open={showLocationError}
        onClose={() => setShowLocationError(false)}
        headerText="Location Disabled"
        bodyText="Location services have been disabled. Please re-enable location services to continue using the app."
        buttonOnePress={() => {
          setShowLocationError(false);
          resetError();
        }}
        buttonTwoPress={() => {
          setShowLocationError(false);
          closeApp();
        }}
      />
    </>
  );
};

export { Feeds };
