import React, { useRef, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { MediaPreview } from "./MediaPreview";
import { Image } from "expo-image";
import { VideoPlayer } from "./VideoScreen";
import { CameraView } from "expo-camera";
import { AlertModal } from "../modals/Alert/AlertModal";
import {
  CircleIcon,
  X as CloseIcon,
  CameraIcon,
  ImagePlusIcon,
  SwitchCameraIcon,
  PauseCircleIcon,
  FlashlightIcon,
  FlashlightOffIcon,
  ApertureIcon,
  PlayIcon,
} from "lucide-react-native";

import {
  Box,
  HStack,
  VStack,
  Button,
  ButtonIcon,
  ButtonText,
  Modal as Modals,
  ModalBackdrop,
} from "@/components/ui";
import { usePermissions } from "@/hooks/usePermissions";
import { useMediaManagement, MediaItem } from "@/hooks/useMediaManagement";
import { CameraControls } from "@/components/media/CameraControls";

interface MediaPickerProps {
  onMediaSelect: (type: "image" | "video", uri: string) => void;
}

export const MediaPicker = ({ onMediaSelect }: MediaPickerProps) => {
  const cameraRef = useRef<CameraView | null>(null);

  const {
    cameraPermission,
    requestCameraPermission,
    microphonePermission,
    requestMicrophonePermission,
    imagePickerPermission,
  } = usePermissions();

  const {
    mediaItems,
    addMediaItem,
    removeMediaItem,
    openGallery,
  } = useMediaManagement();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [flash, setFlash] = useState<"off" | "auto" | "on">("off");
  const [permissionError, setPermissionError] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [mode, setMode] = useState<"picture" | "video">("picture");

  // Open camera
  const openCamera = async () => {
    if (!cameraPermission || !microphonePermission) {
      return <Box />;
    }

    if (!cameraPermission.granted || !microphonePermission.granted) {
      setPermissionError(true);
    } else {
      setIsCameraOpen(true);
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
      const newMediaItem: MediaItem = {
        type: "image",
        uri: image.uri,
      };
      addMediaItem(newMediaItem);
      onMediaSelect("image", image.uri);
      camera.pausePreview();
      setShowPreview(true);
    }
  };

  // Capture video
  const captureVideo = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
    setIsRecording(true);
    const video = await camera.recordAsync({ maxDuration: 10 });
    if (video) {
      const newMediaItem: MediaItem = {
        type: "video",
        uri: video.uri,
      };
      addMediaItem(newMediaItem);
      onMediaSelect("video", video.uri);
      setIsRecording(false);
      camera.pausePreview();
      setShowPreview(true);
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
  const handleCameraClose = () => {
    setIsRecording(false);
    setShowPreview(false);
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
          className="bg-blue-400 data-[hover=true]:bg-blue-600 data-[active=true]:bg-blue-700 mb-2"
        >
          <ButtonIcon as={ImagePlusIcon} className="" size="xl" color="white" />
          <ButtonText>Open Gallery</ButtonText>
        </Button>
        {/* Media Content */}
        <ScrollView horizontal>
          {mediaItems.map((item) => (
            <View key={item.uri} style={styles.mediaContainer}>
              {item.type === "image" ? (
                <Image source={{ uri: item.uri }} style={styles.media} />
              ) : (
                <View style={styles.videoContainer}>
                  <VideoPlayer source={item.uri} />
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => console.log("Play video")}
                  >
                    <PlayIcon size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMediaItem(item.uri)}
              >
                <CloseIcon size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </VStack>
      {/** Preview media */}
      <MediaPreview
        isOpen={showPreview}
        mediaType={
          mediaItems.length > 0
            ? mediaItems[mediaItems.length - 1].type
            : "image"
        }
        source={
          mediaItems.length > 0 ? mediaItems[mediaItems.length - 1].uri : ""
        }
        onClose={() => {
          setShowPreview(false);
          cameraRef.current?.resumePreview();
        }}
        onNext={() => handleCameraClose()}
      />
      {/** Camera modal */}

      <Modals
        isOpen={isCameraOpen}
        onClose={() => handleCameraClose()}
        isKeyboardDismissable={false}
        closeOnOverlayClick={true}
        avoidKeyboard={true}
      >
        <ModalBackdrop />
        <CameraView
          style={styles.cameraView}
          facing={facing}
          mode={mode}
          flash={flash}
          zoom={0}
          enableTorch={flash === "on"}
          ref={cameraRef}
          ratio="1:1"
          active={isCameraOpen}
        />
        {/** Close and flashlight buttons */}
          <Button
            onPress={() => handleCameraClose()}
            className="rounded-full bg-primary-950/20 w-14 h-14 absolute top-5 left-5"
          >
            <ButtonIcon as={CloseIcon} size="xl" className="" />
          </Button>

        <CameraControls
          mode={mode}
          isRecording={isRecording}
          flash={flash}
          toggleCameraFacing={toggleCameraFacing}
          toggleCameraMode={toggleCameraMode}
          toggleCameraFlash={toggleCameraFlash}
          captureImage={captureImage}
          captureVideo={captureVideo}
          stopRecording={stopRecording}
          openGallery={openGallery}
        />
      </Modals>

      {/** camera permission error modal */}
      <AlertModal
        open={permissionError}
        onClose={() => setPermissionError(false)}
        headerText="Camera Permission"
        bodyText="Please grant camera permission to use this feature."
        buttonOnePress={() => {
          requestCameraPermission(),
            requestMicrophonePermission(),
            setPermissionError(false);
        }}
        buttonOneText="Grant Permission"
        buttonTwoText="Exit"
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  media: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  mediaContainer: {
    position: "relative",
  },
  videoContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 5,
  },
  cameraView: {
    flex: 1,
    width: "100%",
  },
});
