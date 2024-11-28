import { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useSession } from "@/context/AuthContext";
import * as SplashScreen from "expo-splash-screen";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // Keep the splash screen visible
  }

  if (!session) {
    return <Redirect href="/auth/signin" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}