import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Wallpaper } from "../types";
import { WallpaperTile } from "./WallpaperTile";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  onWallpaperPress: (wallpaper: Wallpaper) => void;
  onWallpaperDownload: (imageUrl: string) => void;
}

export function WallpaperGrid({
  wallpapers,
  onWallpaperPress,
  onWallpaperDownload,
}: WallpaperGridProps) {
  if (wallpapers.length === 0) {
    return (
      <View className="items-center justify-center flex-1">
        <Ionicons name="images-outline" size={80} color="#fca5a5" />
        <Text className="text-gray-700 text-center py-4 text-lg">
          No wallpapers in your gallery yet
        </Text>
        <Text className="text-gray-500 text-center px-10">
          Head to the Create tab to generate your first wallpaper
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={wallpapers}
      renderItem={({ item }) => (
        <WallpaperTile
          wallpaper={item}
          onPress={onWallpaperPress}
          onDownload={onWallpaperDownload}
        />
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
