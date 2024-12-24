import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser, RegisterResponse } from "@/api/authHelper";
import { AlertTriangle } from "lucide-react-native";
import {
  formSchema,
  FormSchemaType,
} from "@/components/forms/schemas/FormSchema";
import { VerifyCodeModal } from "@/components/modals/VerifyEmailModal";
import { sendCode } from "@/api/authHelper";
import {
  VStack,
  Text,
  Box,
  Center,
  Toast,
  useToast,
  ToastTitle,
  SafeAreaView,
  Input,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  InputSlot,
  InputIcon,
  Button,
  ButtonText,
} from "@/components/ui";

import { EyeIcon, EyeOffIcon, Icon } from "@/components/ui";
import { Keyboard } from "react-native";

const SignUp = () => {
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema.omit({ code: true })),
  });

  const router = useRouter();
  const toast = useToast();



  const onSubmit = async (data: FormSchemaType) => {
    Keyboard.dismiss();
    setIsLoading(true);
    if (data.password !== data.confirmPassword) {
      toast.show({
        placement: "top",
        duration: 1000,
        render: ({ id }: { id: string }) => {
          return (
            <Toast nativeID={id} variant="outline" action="error">
              <ToastTitle>Passwords do not match</ToastTitle>
            </Toast>
          );
        },
      });
      setIsLoading(false);
      return;
    } else {
      try {
        const response = (await registerUser({
          email: data.email,
          password: data.password,
        })) as RegisterResponse;
        if (response) {
          await sendCode({ email: data.email });
          toast.show({
            placement: "top",
            duration: 3000,
            render: ({ id }: { id: string }) => {
              return (
                <Toast nativeID={id} variant="outline" action="success">
                  <ToastTitle>Account created successfully</ToastTitle>
                </Toast>
              );
            },
          });
          setShowVerifyEmailModal(true);
        }
      } catch (error) {
        toast.show({
          placement: "top",
          duration: 3000,
          render: ({ id }: { id: string }) => {
            return (
              <Toast nativeID={id} variant="outline" action="error">
                <ToastTitle>
                  {(error as any).response?.data?.message ||
                    "An unexpected error occurred"}
                </ToastTitle>
              </Toast>
            );
          },
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const handleConfirmPasswordState = () => {
    setShowConfirmPassword((showState) => {
      return !showState;
    });
  };
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <Box className="flex-1">
      <SafeAreaView className="md:hidden flex h-48 bg-Teal"></SafeAreaView>
      <Box className="hidden md:flex md:flex-col md:w-1/4 md:h-full md:bg-Teal md:fixed md:left-0 z-20"></Box>
      <StatusBar style="auto" translucent={false} backgroundColor={"#008080"} />
      <VStack className="flex-1 md:flex-none flex-col max-w-full pt-5 md:pt-20 md:ml-80">
        <VStack className="bg-Auto p-5 pb-0 flex-col items-center z-10">
          {/* ----------------------------------- Sign Up ------------------------------------------ */}
          <FormControl className=" w-80" isInvalid={!!errors?.email}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await formSchema.parseAsync({ email: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12 ">
                  <InputField
                    className="text-sm "
                    type="text"
                    placeholder="Email"
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
                {errors?.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/*----------------------------------- Password ------------------------------------------ */}
          <FormControl className="w-80" isInvalid={!!errors.password}>
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await formSchema.parseAsync({
                      password: value,
                    });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12">
                  <InputField
                    className="text-sm"
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/* ------------------------------------------ Confirm Password -------------------------------------------*/}
          <FormControl className="w-80" isInvalid={!!errors.confirmPassword}>
            <FormControlLabel>
              <FormControlLabelText>Confirm Password</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="confirmPassword"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await formSchema.parseAsync({
                      confirmPassword: value,
                    });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className="h-12">
                  <InputField
                    className="text-sm"
                    placeholder="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    type={showConfirmPassword ? "text" : "password"}
                  />

                  <InputSlot
                    onPress={handleConfirmPasswordState}
                    className="pr-3"
                  >
                    <InputIcon
                      as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                    />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.confirmPassword?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/* ----------------------------------- Sign Up Button ------------------------------------------ */}
          <VStack className="w-80 my-5">
            <Button
              isDisabled={isLoading}
              className="w-full h-12 bg-Teal data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText className="font-medium">
                {isLoading ? "Loading..." : "Sign up"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </VStack>
      <VStack className="flex-1 justify-center items-center md:ml-80">
        <VStack className="justify-center items-center gap-2">
          <Text size="md">Already have an account?</Text>
          <Button
            className="bg-IndianRed w-52 data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
            size="md"
            onPress={() => router.push("/auth/signin")}
          >
            <ButtonText>Sign In</ButtonText>
          </Button>
        </VStack>
      </VStack>
      <Center className="md:ml-80">
        <Text size="2xs" className="text-primary-100">
          Powered By
        </Text>
        <Text size="2xs" className="text-primary-100">
          Sanux Technologies
        </Text>
      </Center>
      {showVerifyEmailModal && (
        <VerifyCodeModal
          email={getValues("email")}
          isOpen={showVerifyEmailModal}
          onClose={() => setShowVerifyEmailModal(false)}
        />
      )}
    </Box>
  );
};

export { SignUp };
