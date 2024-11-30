import React from "react";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable } from "react-native";
import { Box, Text, VStack, Heading, Button, ButtonText } from "@/components/ui";

interface VideoPlayerProps {
  source: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <VStack className="flex flex-col items-center justify-center space-y-4">
      {/* Video View */}
      <VideoView
        style={{ width: "100%", aspectRatio: 16 / 9 }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        className="rounded-lg overflow-hidden"
      />

      {/* Controls */}
      <Pressable
        onPress={() => {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        }}
        className="py-2 px-4 bg-blue-500 rounded-full active:bg-blue-600"
      >
        <Text className="text-white font-bold text-center">
          {isPlaying ? "Pause" : "Play"}
        </Text>
      </Pressable>
    </VStack>
  );
};
