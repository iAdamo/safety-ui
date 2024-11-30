import * as React from "react";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";
import { Audio } from "expo-av";
import { useVideoPlayer, VideoView } from "expo-video";
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
            zone?.severityLevel === "High"
              ? "bg-IndianRed"
              : zone?.severityLevel === "Medium"
              ? "bg-Khaki"
              : "bg-SteelBlue"
          } items-center`}
        >
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700"
            />
          </ModalCloseButton>
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
          <Card className="p-5 rounded-lg max-w-[360px] m-3">
            <Text className="text-sm font-normal mb-2 text-typography-700">
              {zone?.createdAt.toLocaleDateString() +
                " " +
                zone?.createdAt.toLocaleTimeString()}
            </Text>
            <VStack className="mb-6">
              <Heading size="md" className="mb-4">
                {zone?.title}
              </Heading>
              <Text size="sm">{zone?.description}</Text>
            </VStack>
          </Card>

          <Card>
            <PagerView style={{ flex: 1, height: 240 }}>
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
