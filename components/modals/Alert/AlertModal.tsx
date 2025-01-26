import React from "react";
import {
  HStack,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  Button,
  ButtonText,
  Heading,
  Text,
} from "@/components/ui";

interface IAlertDialog {
  open: boolean;
  onClose: () => void;
  useRNModal?: boolean;
  defaultIsOpen?: boolean;
  initialFocusRef?: React.RefObject<any>;
  finalFocusRef?: React.RefObject<any>;
  avoidKeyboard?: boolean;
  closeOnOverlayClick?: boolean;
  isKeyboardDismissable?: boolean;
  headerText: string;
  bodyText: string;
  buttonOneText?: string;
  buttonTwoText?: string;
  buttonOnePress?: () => void;
  buttonTwoPress?: () => void;
}

export const AlertModal: React.FC<IAlertDialog> = ({
  open,
  onClose,
  useRNModal = false,
  defaultIsOpen = false,
  initialFocusRef,
  finalFocusRef,
  avoidKeyboard = false,
  closeOnOverlayClick = false,
  isKeyboardDismissable = true,
  headerText,
  bodyText,
  buttonOneText = "Try Again",
  buttonTwoText = "Exit",
  buttonOnePress,
  buttonTwoPress,
}) => {
  return (
    <AlertDialog
      isOpen={open}
      onClose={onClose}
      size="md"
      useRNModal={useRNModal}
      defaultIsOpen={defaultIsOpen}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      avoidKeyboard={avoidKeyboard}
      closeOnOverlayClick={closeOnOverlayClick}
      isKeyboardDismissable={isKeyboardDismissable}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent className="gap-2">
        <AlertDialogHeader className="justify-center">
          <Heading>{headerText}</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-center">{bodyText}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <HStack className="mt-4 justify-between w-full">
            {buttonOnePress && (
              <Button
                className="w-[45%] bg-teal-500 data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
                onPress={buttonOnePress}
                size="sm"
              >
                <ButtonText>{buttonOneText}</ButtonText>
              </Button>
            )}
            {buttonTwoPress && (
              <Button
                className="w-[45%] bg-red-500 data-[hover=true]:bg-red-600 data-[active=true]:bg-red-700"
                size="sm"
                onPress={buttonTwoPress}
              >
                <ButtonText>{buttonTwoText}</ButtonText>
              </Button>
            )}
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
