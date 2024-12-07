import { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/context/AuthContext";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (!session) {
    return <Redirect href="/auth/signin" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
