import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import {
  formSchema,
  FormSchemaType,
} from "@/components/forms/schemas/FormSchema";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import { useSession } from "@/context/AuthContext";
import {
  VStack,
  HStack,
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
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  InputSlot,
  InputIcon,
  Button,
  ButtonText,
  Link,
  LinkText,
} from "@/components/ui";

import { EyeIcon, EyeOffIcon } from "@/components/ui";
import { Keyboard } from "react-native";

type ControllerRenderType = {
  field: {
    onChange: (value: string) => void;
    onBlur: () => void;
    value: string;
  };
};

const Login = () => {
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { login } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const toast = useToast();

  // handle form submission
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(
      formSchema.omit({ confirmPassword: true, code: true })
    ),
  });

  // handle form validation
  const [validated, setValidated] = React.useState({
    emailValid: true,
    passwordValid: true,
  });

  // handle form submission
  const onSubmit = async (data: FormSchemaType) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      await login(data);
      setIsLoading(false);
    } catch (error) {
      setValidated({ emailValid: false, passwordValid: false });
      toast.show({
        placement: "top",
        duration: 5000,
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
  };

  // handle password visibility
  const [showPassword, setShowPassword] = React.useState(false);

  // handle password visibility
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  // handle form submission on enter key press
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <Box className="flex-1">
      <SafeAreaView className="md:hidden flex h-48 bg-IndianRed"></SafeAreaView>
      <Box className="hidden md:flex md:flex-col md:w-1/4 md:h-full md:bg-IndianRed md:fixed md:left-0 z-20"></Box>
      <StatusBar style="auto" backgroundColor={"#CD5C5C"} />
      <VStack className="flex max-w-full pt-14 flex-col items-center md:pt-20 md:ml-80 md:mt-20">
        <VStack className="flex p-5 mx-5 mb-5 flex-col items-center gap-6">
          <FormControl
            className=" w-80"
            isInvalid={!!errors?.email || !validated.emailValid}
          >
            <Controller
              defaultValue=""
              name="email"
              control={control}
              rules={{
                validate: async (value: string) => {
                  try {
                    await formSchema.parseAsync({ email: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({
                field: { onChange, onBlur, value },
              }: ControllerRenderType) => (
                <Input className="h-12">
                  <InputField
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    className=""
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message || !validated.emailValid}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          {/** Password */}
          <FormControl
            className=" w-80"
            isInvalid={!!errors.password || !validated.passwordValid}
          >
            <Controller
              defaultValue=""
              name="password"
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await formSchema.parseAsync({ password: value });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({
                field: { onChange, onBlur, value },
              }: ControllerRenderType) => (
                <Input className="h-12 ">
                  <InputField
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    className=""
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.password?.message || !validated.passwordValid}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <VStack className="w-80 ">
            <Button
              isDisabled={isLoading}
              className="w-full h-12 bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText className="font-medium">
                {isLoading ? "Loading..." : "Log In"}
              </ButtonText>
            </Button>
          </VStack>
          <HStack>
            <Link onPress={() => setShowForgotPasswordModal(true)}>
              <LinkText className="font-medium text-sm text-primary-700 group-hover/link:text-primary-600">
                Forgot Password?
              </LinkText>
            </Link>
          </HStack>
        </VStack>
      </VStack>
      <VStack className="flex-1 justify-center items-center md:ml-80">
        <Text size="md">Don't have an account?</Text>
        <Button
          className="bg-Teal w-52 data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
          size="md"
          onPress={() => router.push("/auth/signup")}
        >
          <ButtonText>Create New Account</ButtonText>
        </Button>
      </VStack>
      <Center className="md:ml-80">
        <Text size="2xs" className="text-primary-100">
          Powered By
        </Text>
        <Text size="2xs" className="text-primary-100">
          Sanux Technologies
        </Text>
      </Center>

      {/** Forgot password modal */}
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
    </Box>
  );
};

export { Login };
