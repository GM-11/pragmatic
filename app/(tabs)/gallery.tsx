import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Wallpaper } from "../../types";
import { useWallpapers } from "../../hooks/useWallpapers";
import { downloadImage } from "../../utils/fileUtils";
import {
  editWallpaperImage,
  createWallpaperObject,
} from "../../lib/wallpaperApi";
import WallpaperGrid from "../../components/WallpaperGrid";
import WallpaperDetail from "../../components/WallpaperDetail";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

export default function Gallery() {
  const { wallpapers, loading, saveWallpaper, deleteWallpaper } =
    useWallpapers();
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const { colors } = useTheme();

  const handleDownload = async (imageUrl: string) => {
    try {
      const downloadedUri = await downloadImage(imageUrl);
      if (downloadedUri) {
        Alert.alert(
          "Success",
          "Wallpaper saved to your gallery in the 'Pragmatic' album."
        );
      } else {
        Alert.alert("Error", "Failed to download wallpaper");
      }
    } catch (error) {
      console.error("Error downloading wallpaper:", error);
      Alert.alert("Error", "Failed to download wallpaper");
    }
  };

  const handleEditImage = async (
    wallpaper: Wallpaper,
    editInstructions: string
  ) => {
    setIsEditing(true);
    try {
      // Use the specialized edit function
      const base64Image = await editWallpaperImage(
        wallpaper.prompt,
        editInstructions
      );

      // Create a combined prompt for record keeping
      const combinedPrompt = `${wallpaper.prompt}, edited: ${editInstructions}`;

      // Create a new wallpaper object
      const newWallpaper = createWallpaperObject(combinedPrompt, base64Image);

      // Save the new wallpaper
      await saveWallpaper(newWallpaper);

      // Select the new wallpaper
      setSelectedWallpaper(newWallpaper);
    } catch (error) {
      console.error("Error editing wallpaper:", error);
      Alert.alert("Error", "Failed to edit wallpaper");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteWallpaper = async (id: string) => {
    try {
      await deleteWallpaper(id);
      setSelectedWallpaper(null); // Return to grid view
    } catch (error) {
      console.error("Error deleting wallpaper:", error);
      Alert.alert("Error", "Failed to delete wallpaper");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />

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
            onEditImage={handleEditImage}
            onDeleteWallpaper={handleDeleteWallpaper}
            isEditing={isEditing}
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
