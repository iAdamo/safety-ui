import { useState, useEffect } from "react";
import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export const usePermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [imagePickerPermission, setImagePickerPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setImagePickerPermission(status === "granted");
    };
    requestPermissions();
  }, []);

  return {
    cameraPermission,
    requestCameraPermission,
    microphonePermission,
    requestMicrophonePermission,
    imagePickerPermission,
  };
};
