import { useState, useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/context/AuthContext";
import { VerifyCodeModal } from "@/components/modals/VerifyEmailModal";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const { userData } = useSession();
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(true);

  if (!session && !userData) {
    return <Stack screenOptions={{ headerShown: false }} />;
  } else if (session && userData?.verified) {
    return <Redirect href="/dashboard/feeds" />;
  } else if (session && !userData?.verified) {
    return (
      <VerifyCodeModal
        email={userData?.email}
        isOpen={showVerifyEmailModal}
        onClose={() => setShowVerifyEmailModal(false)}
      />
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
