import React from "react";
import {
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading>{headerText}</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-center">{bodyText}</Text>
        </AlertDialogBody>
        <AlertDialogFooter className="justify-between">
          {buttonOnePress && (
            <Button
              className="bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
              onPress={buttonOnePress}
              size="sm"
            >
              <ButtonText>{buttonOneText}</ButtonText>
            </Button>
          )}
          {buttonTwoPress && (
            <Button
              className="bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
              size="sm"
              onPress={buttonTwoPress}
            >
              <ButtonText>{buttonTwoText}</ButtonText>
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
