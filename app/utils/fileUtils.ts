import * as FileSystem from "expo-file-system";
import { Alert, Platform } from "react-native";

/**
 * Downloads an image from a URL or saves a base64 image to file system
 * @param imageUrl URL or base64 string of the image
 * @returns Promise with the file URI if successful, null otherwise
 */
export const downloadImage = async (
  imageUrl: string
): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      Alert.alert("Info", "Download not supported on web");
      return null;
    }

    // For base64 images
    if (imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1];
      const fileName = `wallpaper_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return fileUri;
    }

    // For URL images
    const fileName = `wallpaper_${Date.now()}.jpg`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      imageUrl,
      fileUri,
      {}
    );

    const downloadResult = await downloadResumable.downloadAsync();

    if (downloadResult) {
      return downloadResult.uri;
    } else {
      throw new Error("Download failed");
    }
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
};
