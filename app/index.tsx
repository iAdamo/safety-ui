import React, { useEffect } from "react";
import { Text, Center, VStack } from "@/components/ui";
import { router } from "expo-router";

const Index = () => {
  // set timeout and push to login screen
  useEffect(() => {
    setTimeout(() => {
      router.push("auth/signin" as any);
    }, 3000);
  }, []);

  return (
    <Center className="flex-1 bg-IndianRed">
      <VStack className="items-center mt-[240] flex-1 gap-5">
        <Text className="text-white" size="6xl">Safety Pro</Text>
        <Text className="text-white" size="2xl">Safety First, Safety Always</Text>
      </VStack>
      <VStack className="mt-4">
        <Text>Sanux Technologies</Text>
      </VStack>
    </Center>
  );
};

export default Index;
