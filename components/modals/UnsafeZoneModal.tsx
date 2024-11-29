import * as React from "react";
import {
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
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  RadioGroup,
  Radio,
  RadioLabel,
  RadioIndicator,
  RadioIcon,
} from "@/components/ui";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UnsafeZoneSchema,
  UnsafeZoneSchemaType,
} from "../forms/schemas/UnsafeZoneSchema";
import { AlertTriangle, CircleIcon } from "lucide-react-native";

interface UnsafeZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UnsafeZoneSchemaType) => void;
  zone?: any;
}

export const UnsafeZoneModal: React.FC<UnsafeZoneModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnsafeZoneSchemaType>({
    resolver: zodResolver(UnsafeZoneSchema),
  });

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isKeyboardDismissable={false}
      closeOnOverlayClick={false}
      avoidKeyboard={true}
    >
      <ModalBackdrop>
        <ModalContent>
          <ModalHeader>
            <Heading>Report Unsafe Zone</Heading>
            <Text>Help us keep our community safe</Text>
          </ModalHeader>
          <ModalBody>
            {/* Title */}
            <FormControl isInvalid={!!errors.title}>
              <FormControlLabel>
                <FormControlLabelText>Title</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="title"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input>
                    <InputField
                      type="text"
                      placeholder="Enter title"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                  </Input>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors.title?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            {/* Description */}
            <FormControl isInvalid={!!errors.description}>
              <FormControlLabel>
                <FormControlLabelText>Description</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Textarea>
                    <TextareaInput
                      placeholder="Enter description"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      onSubmitEditing={handleKeyPress}
                      returnKeyType="done"
                    />
                  </Textarea>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors.description?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
            {/* Severity */}
            <FormControl isInvalid={!!errors.severity}>
              <FormControlLabel>
                <FormControlLabelText>Severity</FormControlLabelText>
              </FormControlLabel>
              <Controller
                name="severity"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    value={value}
                    onChange={onChange}
                    accessibilityLabel="Severity"
                  >
                    <VStack>
                      <Radio size="md" value="Low">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Low</RadioLabel>
                      </Radio>
                      <Radio size="md" value="Medium">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Medium</RadioLabel>
                      </Radio>
                      <Radio size="md" value="High">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>High</RadioLabel>
                      </Radio>
                    </VStack>
                  </RadioGroup>
                )}
              />
              <FormControlError>
                <FormControlErrorIcon size="md" as={AlertTriangle} />
                <FormControlErrorText>
                  {errors.severity?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleSubmit(onSubmit)}>
              <ButtonText>Submit</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalBackdrop>
    </Modal>
  );
};