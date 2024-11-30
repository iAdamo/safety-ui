import * as React from "react";
import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  ButtonSpinner,
  Input,
  InputField,
  ArrowLeftIcon,
  Link,
  LinkText,
  Textarea,
  TextareaInput,
  Icon,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Card,
} from "@/components/ui";
import { Keyboard } from "react-native";
import { AlertTriangle, CircleIcon, X as CloseIcon } from "lucide-react-native";
import { IUnsafeZoneResponse } from "@/components/componentTypes";

interface ViewUnsafeModalProps {
  isOpen: boolean;
  onClose: () => void;
  zone?: IUnsafeZoneResponse;
}

export const ViewUnsafeModal = (props: ViewUnsafeModalProps) => {
  const { isOpen, onClose, zone } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isKeyboardDismissable={false}
      closeOnOverlayClick={false}
      avoidKeyboard={true}
      className=""
    >
      <ModalBackdrop />
      <ModalContent className="">
        <ModalHeader
          className={`justify-center ${
            zone?.severityLevel === "High"
              ? "bg-IndianRed"
              : zone?.severityLevel === "Medium"
              ? "bg-Khaki"
              : "bg-SteelBlue"
          } items-center`}
        >
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
            />
          </ModalCloseButton>
          <VStack>
            <Heading className="text-center text-white">
              {zone?.severityLevel} Unsafe Zone
            </Heading>
            <Text className="text-center text-white">Help us keep our community safe</Text>
          </VStack>
        </ModalHeader>
        <ModalBody>
          {/* Title and description */}
          <Card className="p-5 rounded-lg max-w-[360px] m-3">
            <Text className="text-sm font-normal mb-2 text-typography-700">
              {zone?.createdAt.toLocaleDateString() +
                " " +
                zone?.createdAt.toLocaleTimeString()}
            </Text>
            <VStack className="mb-6">
              <Heading size="md" className="mb-4">
                {zone?.title}
              </Heading>
              <Text size="sm">{zone?.description}</Text>
            </VStack>
          </Card>
          {/** Address and Location */}
          <Card></Card>
          {/** Media */}
          <Card></Card>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            className="w-full bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
            onPress={onClose}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
