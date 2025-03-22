import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
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

    // Request permission to access media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access media library was denied"
      );
      return null;
    }

    let fileUri: string;

    // For base64 images
    if (imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1];
      const fileName = `wallpaper_${Date.now()}.jpg`;
      fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } else {
      // For URL images
      const fileName = `wallpaper_${Date.now()}.jpg`;
      fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        imageUrl,
        fileUri,
        {}
      );

      const downloadResult = await downloadResumable.downloadAsync();
      if (!downloadResult) {
        throw new Error("Download failed");
      }
      fileUri = downloadResult.uri;
    }

    // Save to media library
    const asset = await MediaLibrary.createAssetAsync(fileUri);

    // Create or get the Pragmatic album
    const album = await MediaLibrary.getAlbumAsync("Pragmatic");
    if (album === null) {
      await MediaLibrary.createAlbumAsync("Pragmatic", asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    return fileUri;
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
};
