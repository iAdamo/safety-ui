import { Text, Center, VStack } from "@/components/ui";
import { StatusBar } from "react-native";

const Loader = () => {
  return (
    <VStack className="flex-1 bg-IndianRed">
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
    </VStack>
  );
};

export default Loader;
