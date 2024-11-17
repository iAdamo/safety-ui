import React, { useRef, useEffect } from "react";
import {
  formSchema,
  FormSchemaType,
} from "@/components/forms/schemas/FormSchema";
import { FormModal } from "../forms/FormModal";
import { resendEmail } from "@/api/authHelper";
import { verifyEmail } from "@/api/authHelper";
import { Toast, ToastTitle, useToast } from "@/components/ui";
import { Keyboard } from "react-native";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [showModal, setShowModal] = React.useState(isOpen);
  const [showModal2, setShowModal2] = React.useState(false);
  const [showModal3, setShowModal3] = React.useState(false);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const toast = useToast();

  const handleSendCode = async (data: FormSchemaType) => {
    try {
      const response = await resendEmail({ email: data.email });
      if (response) {
        toast.show({
          placement: "top",
          duration: 10000,
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="outline" action="success">
                <ToastTitle>Code sent, Check your inbox</ToastTitle>
              </Toast>
            );
          },
        });
        Keyboard.dismiss();
        setShowModal2(true);
      }
    } catch (error) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="outline" action="error">
              <ToastTitle>{String(error)}</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  const handleVerifyEmail = async (data: FormSchemaType) => {
    try {
      const response = await verifyEmail({
        email: data.email,
        code: data.code,
      });
      if (response) {
        toast.show({
          placement: "top",
          duration: 3000,
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="outline" action="success">
                <ToastTitle>Email Verified</ToastTitle>
              </Toast>
            );
          },
        });
        Keyboard.dismiss();
        setShowModal3(true);
      }
    } catch (error) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="outline" action="error">
              <ToastTitle>{(error as Error).message}</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  const handlePasswordReset = async (data: FormSchemaType) => {
    try {
      const response = await resetPassword({
        email: data.email,
        password: data.password,
      });
      if (response) {
        toast.show({
          placement: "top",
          duration: 3000,
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="outline" action="success">
                <ToastTitle>Password reset successfully</ToastTitle>
              </Toast>
            );
          },
        });
        Keyboard.dismiss();
        setShowModal(false);
        setShowModal2(false);
        setShowModal3(false);
        onClose();
      }
    } catch (error) {
      toast.show({
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="outline" action="error">
              <ToastTitle>{(error as Error).message}</ToastTitle>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <>
      <FormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          onClose();
        }}
        title="Forgot password?"
        description="No worries, we'll send you reset instructions"
        fields={[
          {
            name: "email",
            label: "Email",
            placeholder: "Enter email",
            type: "email",
          },
        ]}
        onSubmit={handleSendCode}
        schema={formSchema.omit({
          password: true,
          confirmPassword: true,
          code: true,
        })}
      />
      <FormModal
        isOpen={showModal2}
        onClose={() => setShowModal2(false)}
        title="Reset password"
        description="A verification code has been sent to you. Enter code below."
        extraText="Didn't receive the code?"
        onSubmit_2={handleSendCode}
        fields={[
          {
            name: "code",
            label: "Verification code",
            placeholder: "Enter verification code",
            type: "text",
          },
        ]}
        onSubmit={handleVerifyEmail}
        schema={formSchema.omit({
          email: true,
          password: true,
          confirmPassword: true,
        })}
      />
      <FormModal
        isOpen={showModal3}
        onClose={() => setShowModal3(false)}
        title="Set new password"
        description="Almost done. Enter your new password and you are all set."
        fields={[
          {
            name: "password",
            label: "Password",
            placeholder: "Set New Password",
            type: "password",
          },
          {
            name: "confirmPassword",
            label: "Confirm Password",
            placeholder: "Confirm New Password",
            type: "password",
          },
        ]}
        onSubmit={handlePasswordReset}
        schema={formSchema.omit({ email: true, code: true })}
      />
    </>
  );
};

export default ForgotPasswordModal;
