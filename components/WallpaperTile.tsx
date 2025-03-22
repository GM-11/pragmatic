import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Wallpaper } from "../types";

interface WallpaperTileProps {
  wallpaper: Wallpaper;
  onPress: (wallpaper: Wallpaper) => void;
  onDownload: (imageUrl: string) => void;
}

const { width } = Dimensions.get("window");
const TILE_WIDTH = width * 0.44;
const TILE_HEIGHT = TILE_WIDTH * 1.8;

export default function WallpaperTile({
  wallpaper,
  onPress,
  onDownload,
}: WallpaperTileProps) {
  return (
    <View className="m-2">
      <TouchableOpacity
        className="rounded-xl overflow-hidden"
        onPress={() => onPress(wallpaper)}
      >
        <Image
          source={{ uri: wallpaper.imageUrl }}
          style={{
            width: TILE_WIDTH,
            height: TILE_HEIGHT,
            borderRadius: 8,
          }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View className="mt-1 px-1 flex-row justify-between items-center">
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-700 text-xs flex-1"
          numberOfLines={1}
        >
          {wallpaper.prompt}
        </Text>
      </View>
    </View>
  );
}
