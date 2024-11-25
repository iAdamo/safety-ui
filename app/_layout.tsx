import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider>
          <AuthChecker>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth/signin" />
              <Stack.Screen name="auth/signup" />
              <Stack.Screen name="dashboard/feeds" />
              <Stack.Screen name="dashboard/map" />
            </Stack>
          </AuthChecker>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}

function AuthChecker({ children }: { children: React.ReactNode }) {
  const authData = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Only attempt redirection if the router is fully mounted
    if (!authData.isAuthenticated) {
      router.replace("/auth/signin");
    } else if (authData.isAuthenticated) {
      router.replace("/dashboard/feeds");
    }
  }, [authData.isAuthenticated, router]);


  return <Slot />; // Ensure the Slot component is rendered
}
