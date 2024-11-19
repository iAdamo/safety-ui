import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Box,
  Center,
  Text,
  VStack,
  HStack,
  SafeAreaView,
  Card,
  Heading,
  Button,
  ButtonIcon,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui";
import { ArrowLeftIcon, PlusIcon } from "lucide-react-native";

const Feeds = () => {
  const [feeds, setFeeds] = useState<{ id: number; title: string; body: string }[]>([]);
  const [modalVisible, setModalVisible] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => {
        setFeeds(json);
      });
  }, []);

  const handleCardPress = (id: number) => {
    setModalVisible((prev) => ({ ...prev, [id]: true }));
  };

  const handleCloseModal = (id: number) => {
    setModalVisible((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Box className="flex-1">
      <SafeAreaView className="h-32 bg-SteelBlue border-0 shadow-hard-5-indianred"></SafeAreaView>
      <VStack className="flex-1 bg-Teal p-5">
        <VStack className="bg-red-400 h-full p-3">
          <ScrollView className="bg-blue-600 flex-col pt-3 mb-10" showsVerticalScrollIndicator={false}>
            {feeds.map((feed) => (
              <TouchableOpacity
                key={feed.id}
                onPress={() => handleCardPress(feed.id)}
              >
                <Card variant="elevated" className="mx-10 mb-3">
                  <Heading size="md" className="mb-1">
                    {feed.title}
                  </Heading>
                  <Text size="sm">{feed.body}</Text>
                </Card>
                <Modal
                  isOpen={modalVisible[feed.id] || false}
                  onClose={() => handleCloseModal(feed.id)}
                  isKeyboardDismissable={true}
                  closeOnOverlayClick={true}
                  avoidKeyboard={true}
                >
                  <ModalBackdrop />
                  <ModalContent>
                    <ModalHeader className="flex-col items-start gap-0.5">
                      <Heading>{feed.title}</Heading>
                      <Text>{feed.body}</Text>
                      <ModalCloseButton onPress={() => handleCloseModal(feed.id)} />
                    </ModalHeader>
                    <ModalBody className="mb-4">
                      <Text>Additional content for {feed.title}</Text>
                    </ModalBody>
                    <ModalFooter className="flex-col items-start">
                      <Button
                        variant="solid"
                        className="w-full bg-SteelBlue data-[hover=true]:bg-SteelBlue-600 data-[active=true]:bg-SteelBlue-700"
                        onPress={() => handleCloseModal(feed.id)}
                      >
                        <ButtonText>Close</ButtonText>
                      </Button>
                      <HStack space="xs" className="items-center">
                        <Button
                          className="gap-1"
                          variant="link"
                          size="sm"
                          onPress={() => handleCloseModal(feed.id)}
                        >
                          <ButtonIcon as={ArrowLeftIcon} />
                          <ButtonText>Back</ButtonText>
                        </Button>
                      </HStack>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </VStack>
      </VStack>
      <VStack className="h-20 bg-SteelBlue border-0 shadow-hard-5-steelblue absolute bottom-0 w-full">
        <Button
          className="absolute bottom-5 right-5 w-16 h-16 rounded-full bg-Khaki data-[hover=true]:bg-Khaki-600 data-[active=true]:bg-Khaki-700"
          onPress={() => router.push("/auth/signup")}
        >
          <ButtonIcon as={PlusIcon} />
        </Button>
      </VStack>
    </Box>
  );
};

export { Feeds };