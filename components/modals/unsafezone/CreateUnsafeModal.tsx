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
  RadioGroup,
  Radio,
  RadioLabel,
  RadioIndicator,
  RadioIcon,
  Card,
  Icon,
  Divider,
} from "@/components/ui";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UnsafeZoneSchema,
  UnsafeZoneSchemaType,
} from "../../forms/schemas/UnsafeZoneSchema";
import { AlertTriangle, CircleIcon, X as CloseIcon } from "lucide-react-native";
import { MediaPicker } from "@/components/media/Media";

interface CreateUnsafeZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UnsafeZoneSchemaType) => void;
}

export const CreateUnsafeModal: React.FC<CreateUnsafeZoneModalProps> = ({
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
      className=""
    >
      <ModalBackdrop />
      <ModalContent className="">
        <ModalCloseButton onPress={onClose} className="">
          <Icon
            as={CloseIcon}
            size="xl"
            className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700"
          />
        </ModalCloseButton>
        <ModalHeader className="justify-center items-center">
          <VStack>
            <Heading className="text-center">Report Unsafe Zone</Heading>
            <Text className="text-center">Help us keep our community safe</Text>
          </VStack>
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
                <Input className="h-12">
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
                <Textarea size="sm" className="h-20">
                  <TextareaInput
                    placeholder="Enter description"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    className="text-left align-top h-20"
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
          {/* SeverityLevel */}
          <Divider className="my-2 " />
          <FormControl isInvalid={!!errors.severityLevel}>
            <FormControlLabel>
              <FormControlLabelText>SeverityLevel</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="severityLevel"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  value={value}
                  onChange={onChange}
                  accessibilityLabel="SeverityLevel"
                >
                  <HStack space="2xl">
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
                  </HStack>
                </RadioGroup>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="md" as={AlertTriangle} />
              <FormControlErrorText>
                {errors.severityLevel?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/* Image */}
          <Card className="rounded-lg border border-outline-300 mt-2">
            <MediaPicker />
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={handleSubmit(onSubmit)}
            className="bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
          >
            <ButtonText>Submit</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
