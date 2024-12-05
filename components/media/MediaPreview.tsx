import { Image } from "expo-image";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { VideoPlayer } from "./VideoScreen";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: "image" | "video";
  source: string;
  onNext: () => void;
}

export const MediaPreview = (props: MediaPreviewModalProps) => {
  const { isOpen, onClose, mediaType, source, onNext } = props;

  const mediaPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media is required!");
      return false;
    }
    return true;
  };

  const saveMedia = async (uri: string, mediaType: "image" | "video") => {
    try {
      const hasPermission = await mediaPermission();
      if (!hasPermission) {
        return;
      }

      const baseDir = `${FileSystem.documentDirectory}SafetyPro`;
      const dirPath =
        mediaType === "image" ? `${baseDir}/Images` : `${baseDir}/Videos`;

      const { exists } = await FileSystem.getInfoAsync(dirPath);
      if (!exists) {
        await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
      }

      const extension = uri.split(".").pop();
      const filePath = `${dirPath}/${Date.now()}.${extension}`;

      await FileSystem.moveAsync({ from: uri, to: filePath });

      const asset = await MediaLibrary.createAssetAsync(filePath);
      console.log("Asset created", asset);

      return filePath;
    } catch (error) {
      console.error("Error saving media", error);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false}>
      <View style={styles.modalView}>
        {/* Close Icon */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>

        {/* Media Content */}
        {mediaType === "image" ? (
          <Image source={{ uri: source }} style={styles.media} />
        ) : (
          <VideoPlayer source={source} />
        )}

        {/* Save Media Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onNext()}
        >
          <Ionicons name="arrow-down-circle" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#2196F3",
    borderRadius: 30,
    padding: 10,
  },
  media: {
    flex: 1,
    resizeMode: "contain",
  },
});
