import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { VideoPlayer } from "./VideoScreen";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
  CameraViewProps,
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
  FlashlightIcon,
  FlashlightOffIcon,
  ApertureIcon,
} from "lucide-react-native";

import {
  Box,
  HStack,
  VStack,
  Heading,
  Button,
  ButtonIcon,
  ButtonText,
  Icon,
  Card,
} from "@/components/ui";

interface MediaPickerProps {
  onMediaSelect: (type: "image" | "video", uri: string) => void;
}

export const MediaPicker = ({ onMediaSelect }: MediaPickerProps) => {
  const cameraRef = useRef<CameraView | null>(null);

  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [permissionError, setPermissionError] = useState<boolean>(false);

  const [status, requestmicrophonePermission] = useMicrophonePermissions();

  const [flash, setFlash] = useState<"off" | "auto" | "on">("off");
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [mode, setMode] = useState<"picture" | "video">("picture");

  // const [maxDuration] = useState<CameraRecordingOptions["maxDuration"]>(10);

  // Open camera
  const openCamera = async () => {
    if (!permission || !status) {
      return <Box />;
    }

    if (!permission.granted || !status.granted) {
      setPermissionError(true);
    } else {
      setIsCameraOpen(true);
    }
  };

  // Open gallery
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMediaType(result.assets[0].type || null);
      setMediaUri(result.assets[0].uri);
      if (mediaType === "image" || mediaType === "video") {
        onMediaSelect(mediaType, result.assets[0].uri);
      }
    }
  };

  // Toggle camera facing
  const toggleCameraFacing = () => {
    setFacing((prevFacing) => (prevFacing === "back" ? "front" : "back"));
  };

  // Toggle camera mode
  const toggleCameraMode = () => {
    setMode((prevMode) => (prevMode === "picture" ? "video" : "picture"));
  };

  // Toggle camera flash
  const toggleCameraFlash = () => {
    setFlash((prevFlash) => {
      if (prevFlash === "off") {
        return "auto";
      } else if (prevFlash === "auto") {
        return "on";
      } else {
        return "off";
      }
    });
  };

  // Capture image
  const captureImage = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    const image = await camera.takePictureAsync();
    if (image) {
      closeCamera();
      setMediaUri(image.uri);
      setMediaType("image");
      onMediaSelect("image", image.uri);
    }
  };

  // Capture video
  const captureVideo = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    setIsRecording(true);
    const video = await camera.recordAsync({ maxDuration: 10 });
    if (video) {
      closeCamera();
      setMediaUri(video.uri);
      setMediaType("video");
      onMediaSelect("video", video.uri);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.stopRecording();
    closeCamera();
  };

  // Close camera
  function closeCamera(): void {
    setIsCameraOpen(false);
    setIsRecording(false);
  }

  return (
    <VStack>
      <VStack className="justify-center gap-2">
        <Button
          onPress={openCamera}
          className="bg-blue-400 data-[hover=true]:bg-blue-600 data-[active=true]:bg-blue-700"
        >
          <ButtonIcon as={CameraIcon} />
          <ButtonText>Open Camera</ButtonText>
        </Button>
        <Button
          onPress={openGallery}
          className="bg-blue-400 data-[hover=true]:bg-blue-600 data-[active=true]:bg-blue-700 mb-2"
        >
          <ButtonIcon as={ImagePlusIcon} className="" size="xl" color="white" />
          <ButtonText>Open Gallery</ButtonText>
        </Button>
      </VStack>
      {/** handle picked media */}
      {mediaUri &&
        (mediaType === "image" ? (
          <View style={styles.mediaPreview}>
            <Image
              source={{ uri: mediaUri }}
              transition={3000}
              style={styles.mediaImage}
            />
          </View>
        ) : mediaType === "video" ? (
          <VideoPlayer source={mediaUri} />
        ) : null)}
      {/** Camera modal */}
      <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <CameraView
            style={styles.cameraView}
            facing={facing}
            mode={mode}
            flash={flash}
            zoom={1}
            enableTorch={flash === "on"}
            ref={cameraRef}
            ratio="1:1"
            active={isCameraOpen}
          />

          <HStack className="absolute top-5 left-5 right-5 justify-between">
            <Button onPress={closeCamera}>
              <ButtonIcon
                as={CloseIcon}
                size="xl"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700"
              />
            </Button>
            <Button onPress={toggleCameraFlash} className="">
              {flash === "on" ? (
                <ButtonIcon as={FlashlightIcon} size="xl" />
              ) : flash === "auto" ? (
                <ButtonIcon as={ApertureIcon} size="xl" />
              ) : (
                <ButtonIcon as={FlashlightOffIcon} size="xl" />
              )}
            </Button>
          </HStack>

          <HStack className="absolute bottom-20 left-5 right-5 justify-between">
            {/** Camera controls */}
            <Button
              onPress={openGallery}
              className="bg-transparent w-12 h-12 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
            >
              <ButtonIcon as={ImagePlusIcon} className="w-10 h-10" />
            </Button>
            {mode === "picture" ? (
              <Button
                onPress={captureImage}
                className="bg-transparent w-20 h-20 data-[hover=true]:bg-transparent data-[active=true]:bg-primary-200 rounded-full"
              >
                <ButtonIcon as={CircleIcon} className="w-20 h-20" />
              </Button>
            ) : (
              <>
                {/** Video controls */}
                {isRecording ? (
                  <Button
                    onPress={stopRecording}
                    className="bg-transparent w-20 h-20 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
                  >
                    <ButtonIcon as={PauseCircleIcon} className="w-20 h-20" />
                  </Button>
                ) : (
                  <Button
                    onPress={captureVideo}
                    className="bg-transparent w-20 h-20 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
                  >
                    <ButtonIcon as={CircleIcon} className="w-20 h-20" />
                  </Button>
                )}
              </>
            )}
            <Button
              onPress={toggleCameraFacing}
              className="w-12 h-12 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
            >
              <ButtonIcon as={SwitchCameraIcon} className="w-10 h-10" />
            </Button>
          </HStack>
          <HStack
            className={
              mode === "picture"
                ? "absolute bottom-5 justify-between left-40 right-18"
                : "absolute bottom-5 justify-between left-18 right-40"
            }
          >
            {/** Camera mode */}
            <Button
              onPress={toggleCameraMode}
              className="bg-transparent marker:w-24 h-10 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
            >
              <ButtonText>Picture</ButtonText>
            </Button>
            <Button
              onPress={toggleCameraMode}
              className="w-24 h-10 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
            >
              <ButtonText>Video </ButtonText>
            </Button>
          </HStack>
        </View>
      </Modal>
      {/** camera permission error modal */}
      <AlertModal
        open={permissionError}
        onClose={() => setPermissionError(false)}
        headerText="Camera Permission"
        bodyText="Please grant camera permission to use this feature."
        buttonOnePress={() => {
          requestPermission(),
            requestmicrophonePermission(),
            setPermissionError(false);
        }}
        buttonOneText="Grant Permission"
        buttonTwoText="Exit"
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  mediaPreview: {
    alignItems: "center",
  },
  mediaImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraView: {
    flex: 1,
    width: "100%",
  },
  cameraControls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  controlButton: {
    color: "#FFF",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
