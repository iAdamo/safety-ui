import { Redirect, Stack } from "expo-router";
import { useSession } from "@/context/AuthContext";
import Index from "../index";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return < Index />;
  }

  if (!session) {
    return <Redirect href="/auth/signin" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
