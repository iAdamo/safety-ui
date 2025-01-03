import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { getMedia } from "@/api/mediaHelper";
import { MediaSystem } from "./useFileSystem";
import { IUnsafeZoneResponse } from "@/components/componentTypes";
import { useSession } from "@/context/AuthContext";

const mediaSystem = new MediaSystem();

export interface MediaItem {
  type: "image" | "video";
  uri: string;
}

export const useMediaManagement = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const { userData } = useSession();

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

    if (!result.canceled && result.assets?.length) {
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

  const saveMedia = async (itemsToSave: MediaItem[], zoneId: string) => {
    try {
      const hasPermission = await mediaPermission();
      if (!hasPermission) return;

      const albumName = `Zone-${zoneId}`;
      let album = await MediaLibrary.getAlbumAsync(albumName);

      for (const [index, mediaItem] of itemsToSave.entries()) {
        // Check if the asset already exists and delete it if necessary
        const existingAssets = await MediaLibrary.getAssetsAsync({
          album,
          mediaType: ["photo", "video"],
        });
        const existingAsset = existingAssets.assets.find(
          (asset) => asset.uri === mediaItem.uri
        );
        if (existingAsset) {
          await MediaLibrary.deleteAssetsAsync([existingAsset.id]);
        }

        const asset = await MediaLibrary.createAssetAsync(mediaItem.uri);

        if (!album || index === 0) {
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

  const getZoneMedia = async (
    zone: IUnsafeZoneResponse,
    checkAndDownload = true
  ): Promise<MediaItem[] | undefined> => {
    try {
      if (!zone) return;

      const hasPermission = await mediaPermission();
      if (!hasPermission) return;

      if (checkAndDownload) await checkAndDownloadMedia(zone);

      const albumName = `Zone-${zone._id}`;
      const album = await MediaLibrary.getAlbumAsync(albumName);
      if (!album) return;
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
  };

  const checkAndDownloadMedia = async (zone: IUnsafeZoneResponse) => {
    try {
      if (zone.markedBy !== userData.id)  return;


      const response = await getMedia(zone._id);
      if (!response) return;

      const remoteMediaItems = response.flatMap((zone: any) =>
        zone.media.map((item: any) => ({
          url: item.url,
          type: item.mediaType === "image/jpeg" ? "image" : "video",
        }))
      );

      let downloadedItems: MediaItem[] = [];
      let localMediaItems: MediaItem[] | undefined;

      const albumName = `Zone-${zone._id}`;
      let album = await MediaLibrary.getAlbumAsync(albumName);

      if (album) {
        localMediaItems = await getZoneMedia(zone, false);
        const missingMediaItems = remoteMediaItems.filter((remoteItem) => {
          const remoteFilename = extractFilename(remoteItem.url);
          return !localMediaItems?.some((localItem) =>
            localItem.uri.includes(remoteFilename)
          );
        });
        if (missingMediaItems.length === 0) return;

        for (const mediaItem of missingMediaItems) {
          const { result } = await mediaSystem.startDownload(
            mediaItem.url,
            extractFilename(mediaItem.url)
          );
          if (result) {
            const newMediaItem: MediaItem = {
              type: mediaItem.type as "image" | "video",
              uri: result.uri,
            };
            downloadedItems.push(newMediaItem);
          }
        }
        await saveMedia(downloadedItems, zone._id);
        return;
      } else {
        for (const remoteItem of remoteMediaItems) {
          const { result } = await mediaSystem.startDownload(
            remoteItem.url,
            extractFilename(remoteItem.url)
          );
          if (result) {
            const newMediaItem: MediaItem = {
              type: remoteItem.type as "image" | "video",
              uri: result.uri,
            };
            downloadedItems.push(newMediaItem);
          }
        }
        await saveMedia(downloadedItems, zone._id);
        return;
      }
    } catch (error) {
      console.error("Error checking and downloading media:", error);
    }
  };

  const extractFilename = (uri: string) => {
    const parts = uri.split("/");
    return parts[parts.length - 1];
  };

  return {
    mediaItems,
    addMediaItem,
    removeMediaItem,
    openGallery,
    saveMedia,
    getZoneMedia,
  };
};
