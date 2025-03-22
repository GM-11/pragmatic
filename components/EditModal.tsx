import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (editInstructions: string) => void;
  isLoading: boolean;
}

export default function EditModal({
  visible,
  onClose,
  onSubmit,
  isLoading,
}: EditModalProps) {
  const [editInstructions, setEditInstructions] = useState("");

  const handleSubmit = () => {
    if (editInstructions.trim()) {
      onSubmit(editInstructions.trim());
      setEditInstructions(""); // Clear after submitting
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[90%] bg-white rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center mb-5 border-b border-gray-100 pb-4">
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-xl text-gray-900"
            >
              Edit Image
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-rose-50 p-1.5 rounded-full"
            >
              <Ionicons name="close" size={24} color="#e11d48" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text
              style={{ fontFamily: "Poppins_500Medium" }}
              className="text-base text-gray-700 mb-2"
            >
              How would you like to edit this image?
            </Text>
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-gray-500 mb-4"
            >
              Describe what you want to change, add, or modify in the current
              image.
            </Text>
            <View className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-100">
              <TextInput
                className="text-gray-800 p-2 rounded-lg w-full"
                placeholder="Example: Make it more vibrant, add clouds to the sky, change the color to blue..."
                placeholderTextColor="#9ca3af"
                value={editInstructions}
                onChangeText={setEditInstructions}
                multiline
                numberOfLines={3}
                style={{
                  textAlignVertical: "top",
                  minHeight: 80,
                  fontFamily: "Poppins_400Regular",
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            className={`bg-rose-600 p-3.5 rounded-xl items-center ${
              isLoading ? "opacity-50" : ""
            }`}
            onPress={handleSubmit}
            disabled={isLoading || !editInstructions.trim()}
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-white text-center"
            >
              {isLoading ? "Editing..." : "Apply Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
