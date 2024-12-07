import { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { closeApp } from "@/utils/CloseApp";
import { AlertModal } from "@/components/modals/Alert/AlertModal";
import { useUnsafeZones } from "@/hooks/useUnsafeZones";
import useLocation from "@/hooks/useLocation";
import { ViewUnsafeModal } from "@/components/modals/unsafezone/ViewUnsafeModal";
import { useRouter } from "expo-router";
import { useSignOut } from "@/hooks/useSignOut";
import { CreateUnsafeModal } from "@/components/modals/unsafezone/CreateUnsafeModal";
import {
  PlusIcon,
  MapPinIcon,
  SettingsIcon,
  PanelTopOpenIcon,
} from "lucide-react-native";
import {
  Box,
  Text,
  VStack,
  SafeAreaView,
  Card,
  Heading,
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
  Badge,
  BadgeText,
  Fab,
  FabIcon,
  Divider,
} from "@/components/ui";

const Feeds = () => {
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { unsafeZones, loading, fetchUnsafeZones } = useUnsafeZones();
  const { location, locationError, requestLocationPermission, resetError } =
    useLocation();
  const [showLocationError, setShowLocationError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUnsafeZones();
  }, [fetchUnsafeZones]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUnsafeZones();
    setRefreshing(false);
  };

  const signOut = useSignOut();
  const router = useRouter();

  if (loading) {
    return (
      <VStack className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </VStack>
    );
  }

  // Show location error modal
  if (locationError) {
    setShowLocationError(true);
  }

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
      <VStack className="flex-1 px-5 pb-16">
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
                <TouchableOpacity
                  key={feed._id}
                  onPress={() => handleCardPress(feed._id)}
                >
                  <Card
                    variant="elevated"
                    className={`mb-3  shadow-red-900 shadow-lg`}
                  >
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
                </TouchableOpacity>
              ))}
          </ScrollView>
        </VStack>
      </VStack>
      <VStack className="h-16 bg-SteelBlue border-0 shadow-hard-5-steelblue absolute bottom-0 w-full"></VStack>

      <VStack className="absolute bottom-20 bg-red-300 -right-2 gap-20">
        <Box>
          <Menu
            offset={5}
            placement="left"
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
            <MenuItem key="Help Center" textValue="Help Center" className="p-2">
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
        <Box>
          <Fab
            className="w-16 h-16 rounded-full bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700 shadow-hard-5"
            placement="bottom right"
          >
            <FabIcon as={PanelTopOpenIcon} />
          </Fab>
        </Box>
        <Box>
          <Fab
            className="w-16 h-16 rounded-full bg-Khaki data-[hover=true]:bg-Khaki-600 data-[active=true]:bg-Khaki-700 shadow-hard-5"
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
      </VStack>

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
      {/** Create an unsafe zone */}
      {location && (
        <CreateUnsafeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          location={location}
        />
      )}
    </Box>
  );
};

export { Feeds };
