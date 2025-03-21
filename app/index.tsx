import { useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Wallpaper } from "./types";
import { useWallpapers } from "./hooks/useWallpapers";
import { WallpaperPreview } from "./components/WallpaperPreview";
import { generateWallpaperImage } from "./lib/wallpaperApi";
import { createWallpaperObject } from "./lib/wallpaperApi";

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { saveWallpaper } = useWallpapers();

  const generateWallpaper = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a prompt");
      return;
    }

    setLoading(true);
    try {
      // Generate the wallpaper image
      const base64Image = await generateWallpaperImage(prompt);

      // Set the preview image
      setPreviewImage(base64Image);

      // Create a wallpaper object
      const newWallpaper = createWallpaperObject(prompt, base64Image);

      // Save to local storage
      await saveWallpaper(newWallpaper);

      setPrompt("");
    } catch (error) {
      console.error("Error generating wallpaper:", error);
      Alert.alert(
        "Error",
        "Failed to generate wallpaper. Please check your API key in the .env file."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (previewImage) {
      Alert.alert("Success", "Wallpaper saved to your gallery");
      setPreviewImage(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-4 pt-6">
          <Text className="text-3xl font-bold text-rose-600 text-center mb-6">
            Pragmatic
          </Text>

          <WallpaperPreview
            imageUrl={previewImage}
            loading={loading}
            onSaveToGallery={handleSaveToGallery}
          />

          {/* Input area at the bottom */}
          <View className="pb-4 pt-2">
            <TextInput
              className="bg-gray-50 text-gray-800 p-4 rounded-xl mb-3 w-full border border-gray-100"
              placeholder="Describe your perfect wallpaper..."
              placeholderTextColor="#9ca3af"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
              style={{ textAlignVertical: "top" }}
            />

            <TouchableOpacity
              className="bg-rose-500 p-4 rounded-xl w-full shadow-sm"
              onPress={generateWallpaper}
              disabled={loading}
            >
              {loading ? (
                <Text className="text-white text-center font-semibold">
                  ✨ Generating...
                </Text>
              ) : (
                <Text className="text-white text-center font-semibold">
                  ✨ Generate Wallpaper
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
