import React from "react";
import { ScrollView } from "react-native";
import {
  Box,
  Center,
  Text,
  VStack,
  HStack,
  SafeAreaView,
  Card,
  Heading,
} from "@/components/ui";

const Feeds = () => {
  const [showFeeds, setShowFeeds] = React.useState(true);
  const [feeds, setFeeds] = React.useState<{ id: number; title: string; body: string }[]>([]);
  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => setFeeds(json));
      if (feeds.length === 0) {
        setShowFeeds(false);
      }
  }, []);



  return (
    <Box className="flex-1">
      <SafeAreaView className="h-32 bg-SteelBlue border-0 shadow-hard-5-indianred"></SafeAreaView>
      <VStack className="flex-1 bg-Teal p-5">
        <VStack className="bg-red-400 h-full p-3">
          <ScrollView className="bg-blue-600 flex-col pt-3 mb-10">
            {showFeeds ? (
              feeds.map((feed) => (
                <Card key={feed.id} variant="elevated" className="mx-10 mb-3">
                  <Heading size="md" className="mb-1">
                    {feed.title}
                  </Heading>
                  <Text size="sm">{feed.body}</Text>
                </Card>
              ))
            ) : (
              <Center className="mt-48">
                <Text>No events currently in your proximity range</Text>
              </Center>
            )}
          </ScrollView>
        </VStack>
      </VStack>
      <VStack className="h-20 bg-SteelBlue border-0 shadow-hard-5-indianred absolute bottom-0 w-full"></VStack>
    </Box>
  );
};

export { Feeds };