import { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useLocationAndUnsafeZones } from "@/hooks/useUnsafeZones";
import { ViewUnsafeModal } from "@/components/modals/unsafezone/ViewUnsafeModal";
import {
  Text,
  VStack,
  Card,
  Heading,
  Divider,
  Pressable,
} from "@/components/ui";

function MyUnsafeZone() {
  const [modalVisible, setModalVisible] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { userUnsafeZones, fetchUserUnsafeZones } = useLocationAndUnsafeZones();
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCardPress = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: true }));
  };

  const handleCloseModal = (_id: string) => {
    setModalVisible((prev) => ({ ...prev, [_id]: false }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserUnsafeZones();
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
        {userUnsafeZones &&
          userUnsafeZones.map((feed) => (
            <Pressable key={feed._id} onPress={() => handleCardPress(feed._id)}>
              <Card variant="elevated" className="mb-3 shadow-lg bg-teal-500">
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
  );
}

export default MyUnsafeZone;
