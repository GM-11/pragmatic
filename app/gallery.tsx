import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Wallpaper } from "./types";
import { useWallpapers } from "./hooks/useWallpapers";
import { downloadImage } from "./utils/fileUtils";
import { WallpaperGrid } from "./components/WallpaperGrid";
import { WallpaperDetail } from "./components/WallpaperDetail";
import { Ionicons } from "@expo/vector-icons";

export default function Gallery() {
  const { wallpapers, loading } = useWallpapers();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(
    null
  );

  const handleDownload = async (imageUrl: string) => {
    const downloadedUri = await downloadImage(imageUrl);
    if (downloadedUri) {
      Alert.alert("Success", `Wallpaper saved to: ${downloadedUri}`);
    } else {
      Alert.alert("Error", "Failed to download wallpaper");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* App header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-2xl text-rose-600"
        >
          My Wallpapers
        </Text>
        <View className="flex-row space-x-2">
          {selectedWallpaper && (
            <TouchableOpacity
              className="bg-rose-50 p-2 rounded-full"
              onPress={() => setSelectedWallpaper(null)}
            >
              <Ionicons name="arrow-back" size={24} color="#e11d48" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1 px-2">
        {selectedWallpaper ? (
          <WallpaperDetail
            wallpaper={selectedWallpaper}
            onBack={() => setSelectedWallpaper(null)}
            onDownload={handleDownload}
            onSetAsWallpaper={handleDownload}
          />
        ) : (
          <WallpaperGrid
            wallpapers={wallpapers}
            onWallpaperPress={setSelectedWallpaper}
            onWallpaperDownload={handleDownload}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
