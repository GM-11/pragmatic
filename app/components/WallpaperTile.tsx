import React from "react";
import { TouchableOpacity, View, Image, Text, Dimensions } from "react-native";
import { Wallpaper } from "../types";

interface WallpaperTileProps {
  wallpaper: Wallpaper;
  onPress: (wallpaper: Wallpaper) => void;
  onDownload: (imageUrl: string) => void;
}

const { width } = Dimensions.get("window");
const numColumns = 2;
const tileSize = width / numColumns - 20; // Account for margins
const imageHeight = tileSize * 1.5; // Make images slightly taller than wide

export function WallpaperTile({
  wallpaper,
  onPress,
  onDownload,
}: WallpaperTileProps) {
  return (
    <TouchableOpacity className="m-2" onPress={() => onPress(wallpaper)}>
      <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <Image
          source={{ uri: wallpaper.imageUrl }}
          style={{ width: tileSize, height: imageHeight, borderRadius: 8 }}
          resizeMode="cover"
        />
        <View className="p-2">
          <View className="flex-row items-center justify-between">
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-700 text-xs flex-1 mr-2"
              numberOfLines={1}
            >
              {wallpaper.prompt}
            </Text>
            <TouchableOpacity
              className="bg-gray-100 px-2 py-1 rounded-md"
              onPress={(e) => {
                e.stopPropagation();
                onDownload(wallpaper.imageUrl);
              }}
            >
              <Text className="text-xs text-gray-700 text-center">💾</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
