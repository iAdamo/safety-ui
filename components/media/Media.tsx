import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
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

export const MediaPicker = ({
  onMediaSelect,
  ...props
}: MediaPickerProps & CameraViewProps) => {
  const cameraRef = useRef<CameraView | null>(null);

  const [maxDuration] = useState<CameraRecordingOptions>({
    maxDuration: 10,
  });

  const [mediaType, setMediaType] = useState<string | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [permissionError, setPermissionError] = useState<boolean>(false);

  const [flash, setFlash] = useState<"off" | "auto" | "on">("off");
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [mode, setMode] = useState<"picture" | "video">("picture");

  // Open camera
  const openCamera = async () => {
    if (!permission) {
      return <Box />;
    }

    if (!permission.granted) {
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
      const mediaType = result.assets[0].type;
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
      setMediaUri(image.uri);
      onMediaSelect("image", image.uri);
      camera.resumePreview();
    }
  };

  // Capture video
  const captureVideo = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    setIsRecording(true);
    const video = await camera.recordAsync();
    if (video) {
      setMediaUri(video.uri);
      onMediaSelect("video", video.uri);
      camera.resumePreview();
    }
  };

  // Stop recording
  const stopRecording = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.stopRecording();
    setIsRecording(false);
  };

  // Close camera
  const closeCamera = () => {
    setIsCameraOpen(false);
  };

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
          className="bg-blue-400 data-[hover=true]:bg-blue-600 data-[active=true]:bg-blue-700"
        >
          <ButtonIcon as={ImagePlusIcon} className="" size="xl" color="white" />
          <ButtonText>Open Gallery</ButtonText>
        </Button>
      </VStack>
      {/** handle picked media */}
      {mediaUri && (
        <View style={styles.mediaPreview}>
          <Image
            source={{ uri: mediaUri }}
            transition={3000}
            style={styles.mediaImage}
          />
        </View>
      )}
      {/** Camera modal */}
      <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <CameraView
            style={styles.cameraView}
            facing={facing}
            mode={mode}
            flash={flash}
            enableTorch={flash === "on"}
            ref={cameraRef}
            ratio="1:1"
            active={isCameraOpen}
            onCameraReady={() => maxDuration}
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
            {mode === "picture" ? (
              <Button onPress={captureImage}>
                <ButtonIcon as={CameraIcon} size="lg" className="" />
              </Button>
            ) : (
              <>
                {/** Video controls */}
                {isRecording ? (
                  <Button onPress={stopRecording}>
                    <ButtonIcon as={PauseCircleIcon} size="lg" />
                  </Button>
                ) : (
                  <Button onPress={captureVideo}>
                    <ButtonIcon as={VideoIcon} size="lg" />
                  </Button>
                )}
              </>
            )}
            <Button onPress={toggleCameraFacing}>
              <ButtonIcon as={SwitchCameraIcon} size="lg" />
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
          setPermissionError(false), requestPermission();
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
    marginTop: 20,
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
