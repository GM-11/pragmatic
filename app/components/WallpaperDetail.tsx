import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Wallpaper } from "../types";

interface WallpaperDetailProps {
  wallpaper: Wallpaper;
  onBack: () => void;
  onDownload: (imageUrl: string) => void;
  onSetAsWallpaper: (imageUrl: string) => void;
}

const { width } = Dimensions.get("window");

export function WallpaperDetail({
  wallpaper,
  onBack,
  onDownload,
  onSetAsWallpaper,
}: WallpaperDetailProps) {
  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4 px-2">
        <TouchableOpacity
          onPress={onBack}
          className="bg-gray-100 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#e11d48" />
        </TouchableOpacity>
        <Text className="text-gray-800 font-medium" numberOfLines={1}>
          {wallpaper.prompt.length > 30
            ? wallpaper.prompt.substring(0, 30) + "..."
            : wallpaper.prompt}
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <View className="bg-gradient-to-b from-rose-50 to-white p-3 rounded-3xl overflow-hidden shadow-md mb-4">
            <Image
              source={{ uri: wallpaper.imageUrl }}
              style={{
                width: width * 0.9,
                height: width * 0.9 * (1920 / 1080),
                borderRadius: 16,
              }}
              resizeMode="contain"
            />
          </View>
          <View className="w-full px-4 space-y-4">
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-gray-800"
            >
              {wallpaper.prompt}
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-500 text-xs"
            >
              Created on {new Date(wallpaper.createdAt).toLocaleString()}
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-rose-500 p-3 rounded-xl shadow-sm"
                onPress={() => onSetAsWallpaper(wallpaper.imageUrl)}
              >
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-center"
                >
                  📱 Set as Wallpaper
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-800 p-3 rounded-xl shadow-sm"
                onPress={() => onDownload(wallpaper.imageUrl)}
              >
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-white text-center"
                >
                  💾 Download
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
