import * as React from "react";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
import { VideoPlayer } from "@/components/media/VideoScreen";
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
} from "@/components/ui";
import { CircleIcon, X as CloseIcon } from "lucide-react-native";
import { IUnsafeZoneResponse } from "@/components/componentTypes";

interface ViewUnsafeModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone?: IUnsafeZoneResponse;
}

export const ViewUnsafeModal = (props: ViewUnsafeModalProps) => {
  const { isOpen, onClose, zone } = props;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const createdAt = zone?.createdAt ? new Date(zone.createdAt) : null;
  const updatedAt = zone?.updatedAt ? new Date(zone.updatedAt) : null;
  const isSameDate =
    createdAt && updatedAt && createdAt.getTime() === updatedAt.getTime();

  const availableContent = [];

  if (zone?.image) {
    availableContent.push(
      <Box key="image" className="flex-1 items-center justify-center">
        <Image
          source={{ uri: zone.image }}
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
        <Text>Swipe ➡️</Text>
      </Box>
    );
  }

  if (zone?.audio) {
    availableContent.push(
      <Box key="audio" className="flex-1 justify-center items-center">
        <Text>Coming Soon</Text>
      </Box>
    );
  }

  if (zone?.video) {
    availableContent.push(
      <Box key="video" className="flex-1 justify-center items-center">
        <VideoPlayer source={zone.video} />
        <Text>Swipe ➡️</Text>
      </Box>
    );
  }

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
          <Card className="rounded-lg border border-outline-300 mt-2 ">
            <Text>{zone?.createdAt ? formatDate(zone.createdAt) : "N/A"}</Text>
            {!isSameDate && (
              <Text>
                Updated At:{" "}
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

          <Card className="rounded-lg border border-outline-300 mt-2 ">
            {availableContent.length > 0 ? (
              <PagerView style={{ height: 320 }} initialPage={0}>
                {availableContent}
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
