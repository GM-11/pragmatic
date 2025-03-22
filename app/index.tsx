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
import { Ionicons } from "@expo/vector-icons";

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

      {/* App header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-2xl text-rose-600"
        >
          Pragmatic
        </Text>
        <TouchableOpacity className="bg-rose-50 p-2 rounded-full">
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#e11d48"
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-1 px-4">
          {/* Main content area */}
          <WallpaperPreview
            imageUrl={previewImage}
            loading={loading}
            onSaveToGallery={handleSaveToGallery}
          />

          {/* Input area */}
          <View className="pb-6 pt-3 space-y-3">
            <View className="bg-gray-50 rounded-2xl p-3 shadow-sm border border-gray-100">
              <TextInput
                className="text-gray-800 p-2 rounded-xl w-full"
                placeholder="Describe your perfect wallpaper in detail..."
                placeholderTextColor="#9ca3af"
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={4}
                style={{
                  textAlignVertical: "top",
                  minHeight: 100,
                  maxHeight: 150,
                  fontFamily: "Poppins_400Regular",
                }}
              />
            </View>

            <TouchableOpacity
              className="bg-rose-600 p-4 rounded-xl w-full shadow-sm flex-row justify-center items-center space-x-2"
              onPress={generateWallpaper}
              disabled={loading}
            >
              <Ionicons name="sparkles" size={20} color="white" />
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-white text-center"
              >
                {loading ? "Creating..." : "Create Wallpaper"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
