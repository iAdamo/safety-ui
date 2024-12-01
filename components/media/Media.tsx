import React, { useRef, useState } from "react";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import {
  CameraView,
  useCameraPermissions,
  CameraViewProps,
  CameraViewRef,
  CameraRecordingOptions,
} from "expo-camera";
import { AlertModal } from "../modals/Alert/AlertModal";
import {
  CircleIcon,
  X as CloseIcon,
  CameraIcon,
  VideoIcon,
  ImagePlusIcon,
  SwitchCameraIcon,
  PauseCircleIcon,
} from "lucide-react-native";

import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  ButtonIcon,
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

export const MediaPicker = (props: CameraViewProps) => {
  let { flash, facing, mode, active } = props;

  const cameraRef = useRef<CameraView | null>(null);

  const [maxDuration] = useState<CameraRecordingOptions>({
    maxDuration: 10,
  });

  const [pickedMedia, setPickedMedia] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [permissionError, setPermissionError] = useState<boolean>(false);

  // Open camera
  const openCamera = async () => {
    if (!permission) {
      return <Box />;
    }

    if (!permission.granted) {
      setPermissionError(true);
      return (
        <AlertModal
          open={permissionError}
          onClose={() => setPermissionError(false)}
          headerText="Camera Permission"
          bodyText="Please grant camera permission to use this feature."
          buttonOnePress={() => {
            setPermissionError(false), requestPermission();
          }}
          buttonOneText="Grant Permission"
          buttonTwoText="Exit"
        />
      );
    } else {
      setIsCameraOpen(true);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPickedMedia(result.assets[0].uri);
    }
  };

  function toggleCameraFacing() {
    facing === "back" ? (facing = "front") : (facing = "back");
  }

  function toggleCameraMode() {
    mode === "picture" ? (mode = "video") : (mode = "picture");
  }

  function toggleCameraFlash() {
    flash === "auto"
      ? (flash = "on")
      : flash === "on"
      ? (flash = "off")
      : (flash = "auto");
  }

  const captureImage = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    const image = await camera.takePictureAsync();
    if (image) {
      setPickedMedia(image.uri);
      camera.resumePreview();
    }
  };

  const captureVideo = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    setIsRecording(true);
    const video = await camera.recordAsync();
    if (video) {
      setPickedMedia(video.uri);
      camera.resumePreview();
    }
  };

  const stopRecording = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.stopRecording();
  };

  const closeCamera = () => {
    active = false;
    setIsCameraOpen(false);
  };

  return (
    <VStack>
      <HStack className="justify-center">
        <Button
          onPress={openCamera}
          className="bg-Khaki data-[hover=true]:bg-Khaki-600 data-[active=true]:bg-Khaki-700"
        >
          <Icon as={CameraIcon} />
          <ButtonText>Camera</ButtonText>
        </Button>
      </HStack>
      {/** handle picked media */}
      {pickedMedia && (
        <Box className="mt-4">
          <Card>
            <Image
              source={{ uri: pickedMedia }}
              className="h-60 w-full"
              placeholder={"U$IDt2sARlja{ff7jaj@RSSgt5bHJ-j@bHaz"}
              transition={3000}
            />
          </Card>
        </Box>
      )}
      {/** Camera modal */}
      <Modal isOpen={isCameraOpen} onClose={closeCamera}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <CameraView
              style={{ width: "100%", aspectRatio: 16 / 9 }}
              facing={facing}
              mode={mode}
              flash={flash}
              ref={cameraRef}
              active={active}
              onCameraReady={() => maxDuration}
            >
              <HStack className="absolute top-5 right-5">
                {/** Camera controls */}
                <Button onPress={openGallery}>
                  <Icon as={ImagePlusIcon} />
                  <ButtonText>Gallery</ButtonText>
                </Button>
                {mode === "picture" ? (
                  <Button onPress={() => captureImage()}>
                    <ButtonIcon as={CameraIcon} size="lg" />
                  </Button>
                ) : (
                  <>
                    {/** Video controls */}
                    {isRecording ? (
                      <Button onPress={() => stopRecording()}>
                        <Icon as={PauseCircleIcon} size="lg" />
                      </Button>
                    ) : (
                      <Button onPress={() => captureVideo()}>
                        <Icon as={VideoIcon} size="lg" />
                      </Button>
                    )}
                  </>
                )}
                <Button onPress={toggleCameraFacing}>
                  <ButtonIcon as={SwitchCameraIcon} size="lg" />
                </Button>
              </HStack>
            </CameraView>
          </ModalBody>
          <ModalFooter>
            <HStack>
              {/** Camera mode */}
              <Button
                onPress={toggleCameraMode}
              >
                <ButtonText className="">
                  {mode === "picture" ? "Video" : "Picture"}
                </ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
