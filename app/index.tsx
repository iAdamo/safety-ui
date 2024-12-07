import React, { useEffect } from "react";
import { Text, Center, VStack } from "@/components/ui";
import { router } from "expo-router";
import { StatusBar } from "react-native";

const Index = () => {
  // set timeout and push to login screen
  useEffect(() => {
    setTimeout(() => {
      router.replace("auth/signin" as any);
    }, 3000);
  }, []);

  return (
    <Center className="flex-1 bg-IndianRed">
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor={"#CD5C5C"}
      />
      <VStack className="items-center mt-80 flex-1 gap-2">
        <Text className="text-white" size="6xl">
          Safety Pro
        </Text>
        <Text className="text-white" size="xl">
          Safety First, Safety Always
        </Text>
      </VStack>
      <Center className="mb-4">
        <Text size="2xs" className="text-white">
          Powered By
        </Text>
        <Text size="2xs" className="text-white">
          Sanux Technologies
        </Text>
      </Center>
    </Center>
  );
};

export default Index;
