import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Wallpaper } from "../types";
import EditModal from "./EditModal";
import LoadingStateManager from "./LoadingStateManager";

interface WallpaperDetailProps {
  wallpaper: Wallpaper;
  onBack: () => void;
  onDownload: (imageUrl: string) => void;
  onSetAsWallpaper: (imageUrl: string) => void;
  onEditImage?: (
    wallpaper: Wallpaper,
    editInstructions: string
  ) => Promise<void>;
  onDeleteWallpaper?: (id: string) => Promise<void>;
  isEditing?: boolean;
}

const { width } = Dimensions.get("window");

export default function WallpaperDetail({
  wallpaper,
  onBack,
  onDownload,
  onSetAsWallpaper,
  onEditImage,
  onDeleteWallpaper,
  isEditing = false,
}: WallpaperDetailProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditSubmit = async (editInstructions: string) => {
    if (onEditImage) {
      setShowEditModal(false); // Close modal immediately to show loading state
      await onEditImage(wallpaper, editInstructions);
    }
  };

  const handleDelete = () => {
    if (onDeleteWallpaper) {
      Alert.alert(
        "Delete Wallpaper",
        "Are you sure you want to delete this wallpaper?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: () => onDeleteWallpaper(wallpaper.id),
            style: "destructive",
          },
        ]
      );
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4 px-2">
        <TouchableOpacity
          onPress={onBack}
          className="bg-gray-100 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#e11d48" />
        </TouchableOpacity>
        <Text className="text-gray-800 font-medium" numberOfLines={1}>
          {wallpaper.prompt.length > 30
            ? wallpaper.prompt.substring(0, 30) + "..."
            : wallpaper.prompt}
        </Text>
        {onDeleteWallpaper && (
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-gray-100 p-2 rounded-full"
          >
            <Ionicons name="trash-outline" size={22} color="#e11d48" />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View className="flex-1 bg-rose-50 rounded-3xl mx-2 shadow-inner overflow-hidden">
          <LoadingStateManager isLoading={true} />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <View className="bg-gradient-to-b from-rose-50 to-white p-3 rounded-3xl overflow-hidden shadow-md mb-4">
              <Image
                source={{ uri: wallpaper.imageUrl }}
                style={{
                  width: width * 0.9,
                  height: width * 0.9 * (1920 / 1080),
                  borderRadius: 16,
                }}
                resizeMode="contain"
              />
            </View>
            <View className="w-full px-4 space-y-4">
              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className="text-gray-800"
              >
                {wallpaper.prompt}
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-500 text-xs"
              >
                Created on {new Date(wallpaper.createdAt).toLocaleString()}
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-rose-500 my-3 p-3 rounded-xl shadow-sm mr-2"
                  onPress={() => onDownload(wallpaper.imageUrl)}
                >
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-white text-center"
                  >
                    💾 Download
                  </Text>
                </TouchableOpacity>

                {onEditImage && (
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 my-3 p-3 rounded-xl shadow-sm"
                    onPress={() => setShowEditModal(true)}
                    disabled={isEditing}
                  >
                    <Text
                      style={{ fontFamily: "Poppins_600SemiBold" }}
                      className="text-rose-600 text-center"
                    >
                      ✏️ Edit
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <EditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        isLoading={isEditing}
      />
    </View>
  );
}
