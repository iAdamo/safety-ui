import React from "react";
import { HStack, Button, ButtonIcon, ButtonText } from "@/components/ui";
import {
  CircleIcon,
  SwitchCameraIcon,
  FlashlightIcon,
  FlashlightOffIcon,
  ApertureIcon,
  PauseCircleIcon,
  ImagePlusIcon,
} from "lucide-react-native";

interface CameraControlsProps {
  mode: "picture" | "video";
  isRecording: boolean;
  flash: "off" | "auto" | "on";
  toggleCameraFacing: () => void;
  toggleCameraMode: () => void;
  toggleCameraFlash: () => void;
  captureImage: () => void;
  captureVideo: () => void;
  stopRecording: () => void;
  openGallery: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  mode,
  isRecording,
  flash,
  toggleCameraFacing,
  toggleCameraMode,
  toggleCameraFlash,
  captureImage,
  captureVideo,
  stopRecording,
  openGallery,
}) => {
  return (
    <>
      <HStack className="absolute bottom-20 left-5 right-5 justify-between">
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
            ? "absolute bottom-5 justify-between left-40 right-18 "
            : "absolute bottom-5 justify-between left-18 right-40"
        }
      >
        {/** Camera mode */}
        <Button
          onPress={toggleCameraMode}
          className={`w-24 h-10 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent ${
            mode === "picture" ? "bg-primary-950/20 rounded-2xl" : "bg-transparent"
          }`}
        >
          <ButtonText>Picture</ButtonText>
        </Button>
        <Button
          onPress={toggleCameraMode}
          className={`w-24 h-10 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent ${
            mode === "video" ? "bg-primary-950/20 rounded-2xl" : "bg-transparent"
          }`}
        >
          <ButtonText>Video</ButtonText>
        </Button>
      </HStack>
      {/** Close and flashlight buttons */}
      <Button
        onPress={toggleCameraFlash}
        className="rounded-full bg-primary-950/20 w-14 h-14 absolute bottom-5 right-5"
      >
        {flash === "on" ? (
          <ButtonIcon as={FlashlightIcon} size="xl" />
        ) : flash === "auto" ? (
          <ButtonIcon as={ApertureIcon} size="xl" />
        ) : (
          <ButtonIcon as={FlashlightOffIcon} size="xl" />
        )}
      </Button>
    </>
  );
};
