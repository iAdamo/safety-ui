import React, { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, LoginResponse } from "@/api/authHelper";
import { AlertTriangle } from "lucide-react-native";
import {
  formSchema,
  FormSchemaType,
} from "@/components/forms/schemas/FormSchema";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import { VerifyCodeModal } from "@/components/modals/VerifyEmailModal";
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
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const toast = useToast();

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

  const [validated, setValidated] = React.useState({
    emailValid: true,
    passwordValid: true,
  });

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = (await loginUser(data)) as LoginResponse;
      if (response) {
        setValidated({ emailValid: true, passwordValid: true });
        if (!response.verified) {
          setShowVerifyEmailModal(true);
          return;
        }
        router.push("/dashboard/feeds");
        toast.show({
          placement: "top",
          duration: 10000,
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="outline" action="success">
                <ToastTitle>"Login successful"</ToastTitle>
              </Toast>
            );
          },
        });
      }
    } catch (error) {
      setValidated({ emailValid: false, passwordValid: false });
      setErrorMessage(
        (error as any).response?.data?.message || "An unexpected error occurred"
      );
      toast.show({
        placement: "top",
        duration: 10000,
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="outline" action="error">
              <ToastTitle>{(error as any).response?.data?.message}</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  //
  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <Box className="flex-1">
      <SafeAreaView className="h-[160px] bg-IndianRed border-0 shadow-hard-5-indianred"></SafeAreaView>
      <VStack className="flex max-w-full pt-14 flex-col items-center">
        <VStack className="flex border-1 shadow-hard-5 p-5 mx-5 mb-5 flex-col items-center gap-6">
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
                <Input className="h-12 focus-within:bg-blue-100 focus-within:border-blue-500">
                  <InputField
                    placeholder="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    className="focus:bg-blue-100 focus:border-blue-500"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message ||
                  (!validated.emailValid && errorMessage)}
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
                <Input className="h-12 focus-within:bg-blue-100 focus-within:border-blue-500">
                  <InputField
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                    className="focus:bg-blue-100 focus:border-blue-500"
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
                {errors?.password?.message ||
                  (!validated.passwordValid && errorMessage)}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <VStack className="w-80 ">
            <Button
              className="w-full h-12 bg-IndianRed data-[hover=true]:bg-IndianRed-600 data-[active=true]:bg-IndianRed-700"
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText className="font-medium">Log In</ButtonText>
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
      <VStack className="flex-1 justify-center items-center">
        <Text size="md">Don't have an account?</Text>
        <Button
          className="bg-Teal w-52 data-[hover=true]:bg-teal-600 data-[active=true]:bg-teal-700"
          size="md"
          onPress={() => router.push("/auth/signup")}
        >
          <ButtonText>Create New Account</ButtonText>
        </Button>
      </VStack>
      <Center className="">
        <Text size="2xs" className="text-primary-100">
          Sanux Technologies
        </Text>
      </Center>
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
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

export { Login };
