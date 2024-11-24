import React from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  Text,
  Heading,
} from "@/components/ui";
import { ArrowLeftIcon } from "lucide-react-native";

interface FeedCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  feed: { id: number; title: string; body: string };
}

const FeedCardModal: React.FC<FeedCardModalProps> = ({ isOpen, onClose, feed }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isKeyboardDismissable={true}
      closeOnOverlayClick={true}
      avoidKeyboard={true}
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="flex-col items-start gap-0.5">
          <Heading>{feed.title}</Heading>
          <Text>{feed.body}</Text>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <ModalBody className="mb-4">
          <Text>{feed.title}</Text>
        </ModalBody>
        <ModalFooter className="flex-col items-start">
          <Button
            variant="solid"
            className="w-full bg-SteelBlue data-[hover=true]:bg-SteelBlue-600 data-[active=true]:bg-SteelBlue-700"
            onPress={onClose}
          >
            <ButtonText>Close</ButtonText>
          </Button>
          <HStack space="xs" className="items-center">
            <Button className="gap-1" variant="link" size="sm" onPress={onClose}>
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText>Back</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { FeedCardModal };
