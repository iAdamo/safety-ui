import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export interface MediaItem {
  type: "image" | "video";
  uri: string;
}

export const useMediaManagement = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [zoneId, setZoneId] = useState<string | null>(null);

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

  const mediaPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (permissionResponse?.status !== "granted") {
      await requestPermission();
    }
    if (status !== "granted") {
      alert("Permission to access media is required!");
      return false;
    }
    return true;
  };

  const saveMedia = async (mediaItems: MediaItem[], zoneId: string) => {
    try {
      const hasPermission = await mediaPermission();
      if (!hasPermission) {
        return;
      }

      const albumName = `Zone-${zoneId}`;
      let album = await MediaLibrary.getAlbumAsync(albumName);

      for (const [index, mediaItem] of mediaItems.entries()) {
        const asset = await MediaLibrary.createAssetAsync(mediaItem.uri);

        if (!album && index === 0) {
          const newAlbumName = `SafetyPro/Zone-${zoneId}`;
          album = await MediaLibrary.createAlbumAsync(
            newAlbumName,
            asset,
            false
          );
        } else if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }

      return album;
    } catch (error) {
      console.error("Error saving media:", error);
    }
  };

  async function getZoneMedia(): Promise<MediaItem[] | undefined> {
    try {
      if (!zoneId) return;

      const hasPermission = await mediaPermission();
      if (!hasPermission) {
        return;
      }

      const albumName = `Zone-${zoneId}`;

      const album = await MediaLibrary.getAlbumAsync(albumName);
      const assets = await MediaLibrary.getAssetsAsync({
        album,
        mediaType: ["photo", "video"],
      });

      return assets.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.mediaType === "photo" ? "image" : "video",
      }));
    } catch (error) {
      console.error("Error getting zone media:", error);
    }
  }

  return {
    mediaItems,
    addMediaItem,
    removeMediaItem,
    openGallery,
    saveMedia,
    setZoneId,
    getZoneMedia,
  };
};
