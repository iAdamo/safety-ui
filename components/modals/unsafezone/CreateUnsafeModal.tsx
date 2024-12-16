import { useState } from "react";
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
import { AlertTriangle, CircleIcon, X as CloseIcon } from "lucide-react-native";
import { MediaPicker } from "@/components/media/MediaPicker";
import { createUnsafeZone } from "@/api/unsafeZoneHelper";
import {
  UnsafeZoneSchema,
  UnsafeZoneSchemaType,
} from "@/components/forms/schemas/UnsafeZoneSchema";
import { IUnsafeZoneRequest } from "@/components/componentTypes";
import { useSession } from "@/context/AuthContext";
import { useLocationAndUnsafeZones } from "@/hooks/useUnsafeZones";

interface CreateUnsafeZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    latitude: number;
    longitude: number;
  };
}

export const CreateUnsafeModal: React.FC<CreateUnsafeZoneModalProps> = ({
  isOpen,
  onClose,
  location,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UnsafeZoneSchemaType>({
    resolver: zodResolver(UnsafeZoneSchema),
    defaultValues: {
      severityLevel: "Low", // Set a default value for severityLevel
    },
  });
  const [loading, setLoading] = useState(false);
  const { userData } = useSession();
  const { fetchUnsafeZones } = useLocationAndUnsafeZones();

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  const handleMediaSelect = (type: "image" | "video", uri: string) => {
    setValue(type, uri);
  };

  const onSubmit = async (data: UnsafeZoneSchemaType) => {
    try {
      setLoading(true);
      const {
        title,
        description,
        radius,
        severityLevel,
        // tags,
        image,
        video,
        audio,
      } = data;
      const unsafeZoneData: IUnsafeZoneRequest = {
        markedBy: userData.id,
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        },
        radius: radius,
        severityLevel: severityLevel.toLowerCase(),
        title: title.toUpperCase(),
        description: description.trim(),
        // tags,
        image,
        video,
        audio,
        resolved: false,
        active: true,
      };
      const response = await createUnsafeZone(unsafeZoneData);
      if (response) {
        fetchUnsafeZones(); // Fetch updated unsafe zones
      }
    } catch (error) {
      console.error("Error creating unsafe zone:", error);
    } finally {
      reset();
      setLoading(false);
      onClose();
    }
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
      <ModalContent className="flex-1 w-full px-0">
        <ModalCloseButton
          onPress={() => {
            onClose();
            reset();
          }}
          className="left-5"
        >
          <Icon
            as={CloseIcon}
            className="w-8 h-8 stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700"
          />
        </ModalCloseButton>
        <ModalHeader className="justify-center items-center">
          <VStack>
            <Heading className="text-center">Report Unsafe Zone</Heading>
            <Text className="text-center">Help us keep our community safe</Text>
          </VStack>
        </ModalHeader>
        <ModalBody className="mt-2 px-2">
          {/* Title */}
          <Card className="rounded-lg border-0 shadow-lg">
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
          </Card>
          {/* SeverityLevel */}
          <Divider className="my-2" />
          <Card className="rounded-lg border-0 shadow-lg">
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
          </Card>
          <Divider className="my-4" />

          {/* Image */}
          <Card
            variant="elevated"
            className="rounded-lg border-0 shadow-lg mt-2"
          >
            <MediaPicker onMediaSelect={handleMediaSelect} />

          </Card>
        </ModalBody>
        <ModalFooter className="right-8">
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
          >
            <ButtonText>{loading ? "Please Wait..." : "Submit"}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
