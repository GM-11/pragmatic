import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WallpaperPreviewProps {
  imageUrl: string | null;
  loading: boolean;
  onSaveToGallery: () => void;
}

const { width } = Dimensions.get("window");
const ASPECT_RATIO = 1920 / 1080;
const imageWidth = width * 0.9;
const imageHeight = imageWidth * ASPECT_RATIO;

export const WallpaperPreview = ({
  imageUrl,
  loading,
  onSaveToGallery,
}: WallpaperPreviewProps) => {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#e11d48" />
        <Text className="text-gray-700 text-center mt-4">
          Generating your wallpaper...
        </Text>
        <Text className="text-gray-500 text-center mt-2 text-xs">
          This may take up to 30 seconds
        </Text>
      </View>
    );
  }

  if (!imageUrl) {
    return (
      <View className="flex-1 items-center justify-center">
        <Ionicons name="image-outline" size={80} color="#fca5a5" />
        <Text className="text-lg font-medium text-gray-700 text-center mb-6">
          Create beautiful mobile wallpapers with AI
        </Text>
        <Text className="text-gray-500 text-center mb-2">
          Type a prompt below and tap Generate
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="items-center space-y-4">
        <View className="bg-gray-50 p-3 rounded-xl overflow-hidden shadow-md border border-gray-100">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: imageWidth, height: imageHeight }}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          className="bg-rose-500 px-6 py-3 rounded-xl shadow-sm"
          onPress={onSaveToGallery}
        >
          <Text className="text-white text-center font-semibold">
            💾 Save to Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
