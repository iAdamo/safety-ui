import React from "react";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable } from "react-native";
import {
  Box,
  Text,
  VStack,
  Heading,
  Button,
  ButtonText,
} from "@/components/ui";

interface VideoPlayerProps {
  source: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const player = useVideoPlayer(source, (player) => {
    // player.loop = true;
    // player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <VStack className="flex-1 flex-col items-center  justify-center space-y-4">
      {/* Video View */}
      <VideoView
        style={{ width: "100%", aspectRatio: 1 / 1 }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        className="rounded-lg overflow-hidden"
      />
    </VStack>
  );
};
