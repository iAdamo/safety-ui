import { useState, useEffect } from "react";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
import { VideoScreen } from "@/components/media/VideoScreen";
import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Icon,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Card,
  Divider,
  Progress,
  ProgressFilledTrack,
} from "@/components/ui";
import { CircleIcon, X as CloseIcon } from "lucide-react-native";
import { IUnsafeZoneResponse, MediaItem } from "@/components/componentTypes";
import { useMediaManagement } from "@/hooks/useMediaManagement";
import { useSession } from "@/context/AuthContext";

interface ViewUnsafeModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone?: IUnsafeZoneResponse;
}

export const ViewUnsafeModal = (props: ViewUnsafeModalProps) => {
  const { isOpen, onClose, zone } = props;
  const { userData } = useSession();
  const { getZoneMedia } = useMediaManagement();
  const [zoneMedia, setZoneMedia] = useState<MediaItem[]>([]);

  let checkMedia: boolean = false;
  useEffect(() => {
    if (isOpen && zone) {
      if (zone.markedBy === userData.id) {
        checkMedia = true;
      }
      getZoneMedia(zone, checkMedia).then((media) => {
        if (media) {
          setZoneMedia(media);
        }
      });
    }
  }, [isOpen, zone]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const createdAt = zone?.createdAt ? new Date(zone.createdAt) : null;
  const updatedAt = zone?.updatedAt ? new Date(zone.updatedAt) : null;
  const isSameDate =
    createdAt && updatedAt && createdAt.getTime() === updatedAt.getTime();

  const renderMediaItem = (media: MediaItem, index: number) => {
    switch (media.type) {
      case "image":
        return (
          <Box
            key={`image-${index}`}
            className="flex-1 items-center justify-center"
          >
            <Image
              source={{ uri: media.uri }}
              style={{ flex: 1, width: "100%", height: "100%" }}
            />
            <Text>Swipe ➡️</Text>
          </Box>
        );
      case "video":
        return (
          <Box
            key={`video-${index}`}
            className="flex-1  justify-center items-center"
          >
            <VideoScreen source={media.uri} />
            <Text>Swipe ➡️</Text>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isKeyboardDismissable={false}
      closeOnOverlayClick={false}
      avoidKeyboard={true}
    >
      <ModalBackdrop />
      <ModalContent className="flex-1 w-full">
        <ModalHeader
          className={`justify-center ${
            zone?.severityLevel === "high"
              ? "bg-IndianRed"
              : zone?.severityLevel === "medium"
              ? "bg-Khaki"
              : "bg-SteelBlue"
          } items-center`}
        >
          <VStack>
            <Heading className="text-center text-white">
              {zone?.severityLevel} Unsafe Zone
            </Heading>
            <Text className="text-center text-white">
              Help us keep our community safe
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody>
          <Card className="rounded-lg border border-outline-300 mt-2">
            <Text>{zone?.createdAt ? formatDate(zone.createdAt) : "N/A"}</Text>
            {!isSameDate && (
              <Text>
                Updated At:
                {zone?.updatedAt ? formatDate(zone.updatedAt) : "N/A"}
              </Text>
            )}
            <Divider className="my-2 " />

            <VStack className="mb-6">
              <Heading size="md" className="mb-4">
                {zone?.title}
              </Heading>

              <Text size="sm">{zone?.description}</Text>
            </VStack>
          </Card>

          <Card className="rounded-lg border border-outline-300 mt-2 justify-center items-center">
            {zoneMedia.length > 0 ? (
              <PagerView style={{ height: 600, width: 320 }} initialPage={0}>
                {zoneMedia?.map((media, index) =>
                  renderMediaItem(media, index)
                )}
              </PagerView>
            ) : (
              <Box className="h-60 justify-center items-center">
                <Text>No content available</Text>
              </Box>
            )}
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            className="w-full bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
            onPress={onClose}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
