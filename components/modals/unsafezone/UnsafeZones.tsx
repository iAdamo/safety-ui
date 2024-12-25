import { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useLocationAndUnsafeZones } from "@/hooks/useUnsafeZones";
import { ViewUnsafeModal } from "@/components/modals/unsafezone/ViewUnsafeModal";
import {
  Text,
  VStack,
  HStack,
  Card,
  Heading,
  Divider,
  Button,
  ButtonIcon,
  Pressable,
  Popover,
  PopoverBackdrop,
  PopoverContent,
} from "@/components/ui";
import { Trash2Icon, PenLineIcon, BarChartBig } from "lucide-react-native";

function UnsafeZones() {
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [popoverVisible, setPopoverVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const {
    unsafeZones,
    loadingZone,
    fetchUnsafeZones,
    loadingLocation,
    locationError,
    requestLocationPermission,
    resetError,
  } = useLocationAndUnsafeZones();  const [refreshing, setRefreshing] = useState(false);

  const handleCardPress = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: true }));
  };

  const handleCloseModal = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: false }));
  };

  const handleLongPress = (_id: string) => {
    setPopoverVisible((prev) => ({ ...prev, [_id]: true }));
  };

  const handleClosePopover = (_id: string) => {
    setPopoverVisible((prev) => ({ ...prev, [_id]: false }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUnsafeZones();
    setRefreshing(false);
  };

  return (
    <VStack className="h-1/2 my-2 p-3">
      <ScrollView
        className="flex-col"
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
            <Popover
              key={feed._id}
              isOpen={popoverVisible[feed._id]}
              onClose={() => handleClosePopover(feed._id)}
              offset={-70}
              placement="bottom"
              size="md"
              trigger={(triggerProps) => {
                return (
                  <Pressable
                    {...triggerProps}
                    onPress={() => handleCardPress(feed._id)}
                    onLongPress={() => handleLongPress(feed._id)}
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
                );
              }}
            >
              <PopoverBackdrop />
              <PopoverContent className="bg-transparent w-full p-0 border-0">
                <HStack className="justify-between gap-20 bg-transparent border-0">
                  <Button
                    variant="link"
                    className="bg-red-400 w-10 h-10  data-[hover=true]:bg-red-100 data-[active=true]:bg-red-200"
                  >
                    <ButtonIcon as={Trash2Icon} className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="link"
                    className="bg-yellow-400 w-10 h-10  data-[hover=true]:bg-yellow-100 data-[active=true]:bg-yellow-200"
                  >
                    <ButtonIcon as={BarChartBig} className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="link"
                    className="bg-green-400 w-10 h-10  data-[hover=true]:bg-green-100 data-[active=true]:bg-green-200"
                  >
                    <ButtonIcon as={PenLineIcon} className="w-6 h-6" />
                  </Button>
                </HStack>
              </PopoverContent>
            </Popover>
          ))}
      </ScrollView>
    </VStack>
  );
}

export default UnsafeZones;
