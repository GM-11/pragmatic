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
const imageWidth = width * 0.85;
const imageHeight = imageWidth * ASPECT_RATIO;

export const WallpaperPreview = ({
  imageUrl,
  loading,
  onSaveToGallery,
}: WallpaperPreviewProps) => {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-rose-50 rounded-3xl mx-2 shadow-inner">
        <ActivityIndicator size="large" color="#e11d48" />
        <Text
          style={{ fontFamily: "Poppins_500Medium" }}
          className="text-gray-700 text-center mt-4"
        >
          Creating your masterpiece...
        </Text>
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-500 text-center mt-2 text-xs px-8"
        >
          We're turning your words into art. This may take up to 30 seconds.
        </Text>
      </View>
    );
  }

  if (!imageUrl) {
    return (
      <View className="flex-1 items-center justify-center bg-gradient-to-b from-rose-50 to-white rounded-3xl mx-2 p-6 shadow-inner">
        <View className="bg-white/80 p-5 rounded-full mb-4 shadow-sm">
          <Ionicons name="sparkles-outline" size={60} color="#e11d48" />
        </View>
        <Text
          style={{ fontFamily: "Poppins_600SemiBold" }}
          className="text-2xl text-gray-700 text-center mb-4"
        >
          Imagine Your Perfect Wallpaper
        </Text>
        <Text
          style={{ fontFamily: "Poppins_400Regular" }}
          className="text-gray-500 text-center mb-2 leading-relaxed px-4"
        >
          Describe any scene, artwork, or design you'd like to see as your
          wallpaper. Be as detailed or creative as you wish.
        </Text>
        <View className="border-b border-gray-200 w-16 my-4" />
        <View className="flex-row items-center justify-center flex-wrap">
          <TouchableOpacity className="bg-white/80 m-1 px-3 py-1 rounded-full shadow-sm">
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-xs text-rose-600"
            >
              Sunset beach
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/80 m-1 px-3 py-1 rounded-full shadow-sm">
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-xs text-rose-600"
            >
              Mountain landscape
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/80 m-1 px-3 py-1 rounded-full shadow-sm">
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-xs text-rose-600"
            >
              Abstract art
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/80 m-1 px-3 py-1 rounded-full shadow-sm">
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-xs text-rose-600"
            >
              Minimalist
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="items-center space-y-5 pt-2">
        <View className="bg-gradient-to-b from-rose-50 to-white p-4 rounded-3xl overflow-hidden shadow-md">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: imageWidth, height: imageHeight, borderRadius: 16 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-row space-x-3 px-4 w-full">
          <TouchableOpacity
            className="flex-1 bg-rose-500 px-6 py-3 rounded-xl shadow-sm"
            onPress={onSaveToGallery}
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-white text-center"
            >
              💾 Save to Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-xl shadow-sm">
            <Ionicons name="refresh-outline" size={22} color="#e11d48" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
