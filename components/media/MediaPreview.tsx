import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { VideoPlayer } from "./VideoScreen";
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
          onPress={() => {onNext()}}
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
