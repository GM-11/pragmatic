import { useState, useRef, useEffect } from "react";
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
import { useWallpapers } from "../hooks/useWallpapers";
import WallpaperPreview from "../components/WallpaperPreview";
import {
  generateWallpaperImage,
  editWallpaperImage,
  createWallpaperObject,
} from "../lib/wallpaperApi";
import { Ionicons } from "@expo/vector-icons";
import InfoModal from "../components/InfoModal";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { saveWallpaper } = useWallpapers();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("");

  // Clear any existing timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const generateWallpaper = async (promptText: string) => {
    if (!promptText.trim()) {
      Alert.alert("Error", "Please enter a prompt");
      return;
    }

    // Clear existing preview and cancel any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoading(true);
    try {
      // Generate the wallpaper image
      const base64Image = await generateWallpaperImage(promptText);

      // Set the preview image and current prompt
      setPreviewImage(base64Image);
      setCurrentPrompt(promptText);

      // Create a wallpaper object
      const newWallpaper = createWallpaperObject(promptText, base64Image);

      // Save to local storage
      await saveWallpaper(newWallpaper);

      if (promptText === prompt) {
        setPrompt("");
      }
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

  const handleEditImage = async (editInstructions: string) => {
    // Use the specialized edit function instead of combining prompts manually
    setLoading(true);
    try {
      const base64Image = await editWallpaperImage(
        currentPrompt,
        editInstructions
      );

      // Create a combined prompt for record keeping
      const combinedPrompt = `${currentPrompt}, edited: ${editInstructions}`;

      // Update the UI with the new image
      setPreviewImage(base64Image);
      setCurrentPrompt(combinedPrompt);

      // Create and save the edited wallpaper
      const newWallpaper = createWallpaperObject(combinedPrompt, base64Image);
      await saveWallpaper(newWallpaper);
    } catch (error) {
      console.error("Error editing wallpaper:", error);
      Alert.alert("Error", "Failed to edit the wallpaper.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (previewImage) {
      try {
        // Request permission to access media library
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Permission to access media library was denied"
          );
          return;
        }

        // For base64 images, write to file first
        if (previewImage.startsWith("data:")) {
          const base64Data = previewImage.split(",")[1];
          const fileUri =
            FileSystem.documentDirectory + `wallpaper_${Date.now()}.jpg`;

          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Save the file to the media library
          const asset = await MediaLibrary.createAssetAsync(fileUri);
          const album = await MediaLibrary.getAlbumAsync("Pragmatic");

          if (album === null) {
            await MediaLibrary.createAlbumAsync("Pragmatic", asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }

          Alert.alert("Success", "Wallpaper saved to your gallery");

          // Set a timeout to clear the preview after 3 seconds
          timeoutRef.current = setTimeout(() => {
            setPreviewImage(null);
          }, 3000);
        } else {
          Alert.alert("Error", "Invalid image format");
        }
      } catch (error) {
        console.error("Error saving to gallery:", error);
        Alert.alert("Error", "Failed to save wallpaper to gallery");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Info Modal */}
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />

      {/* App header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-2xl text-rose-600"
        >
          Pragmatic
        </Text>
        <TouchableOpacity
          className="bg-rose-50 p-2 rounded-full"
          onPress={() => setShowInfoModal(true)}
        >
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
            onEditImage={handleEditImage}
            currentPrompt={currentPrompt}
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
              className="bg-rose-600 p-4 rounded-xl w-full shadow-sm flex-row justify-center items-center space-x-2 mt-2"
              onPress={() => generateWallpaper(prompt)}
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
