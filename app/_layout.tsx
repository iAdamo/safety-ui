import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
  return (
    <GluestackUIProvider >
        <StatusBar barStyle="dark-content" translucent={true} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/signin" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="dashboard/feeds" />
          <Stack.Screen name="dashboard/map" />
        </Stack>
    </GluestackUIProvider>
  );
}
