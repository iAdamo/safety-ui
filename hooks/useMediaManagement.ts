import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export interface MediaItem {
  type: "image" | "video";
  uri: string;
}

export const useMediaManagement = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const addMediaItem = (newMediaItem: MediaItem) => {
    setMediaItems((prevItems) => [...prevItems, newMediaItem]);
  };

  const removeMediaItem = (uri: string) => {
    setMediaItems((prevItems) => prevItems.filter((item) => item.uri !== uri));
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newMediaItem: MediaItem = {
        type: result.assets[0].type as "image" | "video",
        uri: result.assets[0].uri,
      };
      addMediaItem(newMediaItem);
    }
  };

  return {
    mediaItems,
    addMediaItem,
    removeMediaItem,
    openGallery,
  };
};
