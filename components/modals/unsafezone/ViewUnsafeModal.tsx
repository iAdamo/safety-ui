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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isKeyboardDismissable={false}
      closeOnOverlayClick={false}
      avoidKeyboard={true}
    >
      <ModalBackdrop />
      <ModalContent>
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
            <PagerView
              style={{ height: 240 }}
              initialPage={0}
            >
              {zone?.image && (
                <Box className="h-60 justify-center items-center">
                  <Image
                    source={{ uri: zone.image }}
                    className="h-full w-full"
                    placeholder={"U$IDt2sARlja{ff7jaj@RSSgt5bHJ-j@bHaz"}
                    transition={3000}
                  />
                  <Text>Swipe ➡️</Text>
                </Box>
              )}
              {zone?.audio && (
                <Box className="h-60 justify-center items-center">
                  <Text>Coming Soon</Text>
                </Box>
              )}
              {zone?.video && (
                <Box className="h-60 justify-center items-center">
                  <VideoPlayer source={zone.video} />
                </Box>
              )}
            </PagerView>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            className="w-full bg-Teal data-[hover=true]:bg-teal-600"
            onPress={onClose}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
