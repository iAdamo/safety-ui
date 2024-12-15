import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { VideoPlayer } from "./VideoScreen";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import {
  HStack,
  Button,
  ButtonIcon,
  Modal as Modals,
  ModalBackdrop,
} from "@/components/ui";
import {
  X as CloseIcon,
  ArrowBigRight
} from "lucide-react-native";

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

      const albumName =
        mediaType === "image" ? "SafetyPro/Images" : "SafetyPro/Videos";

      const asset = await MediaLibrary.createAssetAsync(uri);

      let album = await MediaLibrary.getAlbumAsync(albumName);
      if (!album) {
        album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      return asset.uri;
    } catch (error) {
      console.error("Error saving media:", error);
    }
  };

  return (
    <Modals
      isOpen={isOpen}
      onClose={() => onClose()}
      isKeyboardDismissable={false}
      closeOnOverlayClick={false}
      avoidKeyboard={true}
      className="bg-black"
    >
      <ModalBackdrop />
      {/* Media Content */}
      {mediaType === "image" ? (
        <Image source={{ uri: source }} style={styles.media} />
      ) : (
        <VideoPlayer source={source} />
      )}
      <HStack className="absolute bottom-20 left-5 right-5 justify-between">
        <Button
          onPress={onClose}
          className="bg-IndianRed w-12 h-12 data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
        >
          <ButtonIcon as={CloseIcon} className="w-10 h-10" />
        </Button>

        <Button
          onPress={() => {
            onNext(), saveMedia(source, mediaType);
          }}
          className="w-12 h-12 bg-Teal data-[hover=true]:bg-transparent data-[active=true]:bg-transparent"
        >
          <ButtonIcon as={ArrowBigRight} className="w-10 h-10" />
        </Button>
      </HStack>
    </Modals>
  );
};

const styles = StyleSheet.create({
  media: {
    flex: 1,
    width: "100%"
  },
});
