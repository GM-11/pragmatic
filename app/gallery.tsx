import React, { useState } from "react";
import { Alert, SafeAreaView, StatusBar, View, Text } from "react-native";
import { Wallpaper } from "./types";
import { useWallpapers } from "./hooks/useWallpapers";
import { downloadImage } from "./utils/fileUtils";
import { WallpaperGrid } from "./components/WallpaperGrid";
import { WallpaperDetail } from "./components/WallpaperDetail";

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
      <View className="flex-1 px-2 pt-6">
        <Text className="text-3xl font-bold text-rose-600 text-center mb-6">
          My Wallpapers
        </Text>

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
