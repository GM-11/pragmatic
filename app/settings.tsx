import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettings, ImageModel, ColorTheme } from "../hooks/useSettings";

// Interface for dropdown option
interface DropdownOption<T> {
  label: string;
  value: T;
  icon?: string;
  description?: string;
  disabled?: boolean;
}

// Custom dropdown component that expands in place
function Dropdown<T>({
  label,
  options,
  selected,
  onSelect,
  renderOption,
  renderSelected,
}: {
  label: string;
  options: DropdownOption<T>[];
  selected: DropdownOption<T>;
  onSelect: (value: T) => void;
  renderOption?: (
    option: DropdownOption<T>,
    isSelected: boolean
  ) => React.ReactNode;
  renderSelected?: (option: DropdownOption<T>) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  // Toggle dropdown
  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : 300; // Increased from 200 to 300 to fit all options
    Animated.timing(heightAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  // Default render function for selected item
  const defaultRenderSelected = (option: DropdownOption<T>) => (
    <View className="flex-row justify-between items-center">
      <Text
        style={{ fontFamily: "Poppins_500Medium" }}
        className="text-gray-800"
      >
        {option?.label || "Select"}
      </Text>
      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={20}
        color="#64748b"
      />
    </View>
  );

  // Default render function for option items
  const defaultRenderOption = (
    option: DropdownOption<T>,
    isSelected: boolean
  ) => (
    <View className="flex-row justify-between items-center">
      <Text
        style={{ fontFamily: "Poppins_500Medium" }}
        className={`${isSelected ? "text-rose-600" : "text-gray-800"}`}
      >
        {option.label}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={18} color="#e11d48" />
      )}
    </View>
  );

  return (
    <View className="mb-3">
      <Text
        style={{ fontFamily: "Poppins_600SemiBold" }}
        className="text-lg text-gray-800 mb-2"
      >
        {label}
      </Text>

      <TouchableOpacity
        className="bg-gray-50 rounded-xl p-4"
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        {renderSelected
          ? renderSelected(selected)
          : defaultRenderSelected(selected)}
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={{
            maxHeight: heightAnim,
            overflow: "hidden",
          }}
          className="bg-white rounded-xl mt-1 shadow-md border border-gray-100 z-10"
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={String(option.value)}
              className={`p-3 border-b border-gray-100 ${
                option.disabled ? "opacity-50" : ""
              }`}
              onPress={() => {
                if (!option.disabled) {
                  onSelect(option.value);
                  toggleDropdown();
                }
              }}
              disabled={option.disabled}
            >
              {renderOption
                ? renderOption(option, option.value === selected.value)
                : defaultRenderOption(option, option.value === selected.value)}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

export default function Settings() {
  const { settings, updateSettings, resetSettings, loading } = useSettings();
  const [isResetting, setIsResetting] = useState(false);

  // Model options
  const modelOptions: DropdownOption<ImageModel>[] = [
    {
      label: "Stable Diffusion XL",
      value: "sd-xl-base",
      description: "High quality, balanced performance",
    },
    {
      label: "Stable Diffusion v1.5",
      value: "sd-v1-5",
      description: "Faster generation, classic style",
    },
    {
      label: "Stable Diffusion 3.5",
      value: "sd-3-5-large",
      description: "Premium model with exceptional quality (Pro only)",
      disabled: !settings.isPro,
    },
    {
      label: "FLUX.1",
      value: "flux-1-dev",
      description: "High-fidelity premium model (Pro only)",
      disabled: !settings.isPro,
    },
  ];

  // Theme options
  const themeOptions: DropdownOption<ColorTheme>[] = [
    {
      label: "Light",
      value: "light",
      icon: "sunny-outline",
    },
    {
      label: "Dark",
      value: "dark",
      icon: "moon-outline",
    },
    {
      label: "System",
      value: "system",
      icon: "contrast-outline",
    },
  ];

  // Handle model selection
  const handleModelChange = (model: ImageModel) => {
    updateSettings({ imageModel: model });
  };

  // Handle theme selection
  const handleThemeChange = (theme: ColorTheme) => {
    updateSettings({ colorTheme: theme });
  };

  // Handle pro status toggle
  const handleProStatusChange = (isPro: boolean) => {
    if (isPro) {
      Alert.alert(
        "Upgrade to Pro",
        "This would typically open a payment flow. For demo purposes, we will enable Pro features directly.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Enable Pro",
            onPress: () => updateSettings({ isPro: true }),
          },
        ]
      );
    } else {
      updateSettings({ isPro: false });
    }
  };

  // Handle reset settings
  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setIsResetting(true);
            await resetSettings();
            setIsResetting(false);
          },
        },
      ]
    );
  };

  // Get selected model option
  const selectedModel =
    modelOptions.find((option) => option.value === settings.imageModel) ||
    modelOptions[0];

  // Get selected theme option
  const selectedTheme =
    themeOptions.find((option) => option.value === settings.colorTheme) ||
    themeOptions[2];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600">Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* App header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <Text
          style={{ fontFamily: "Poppins_700Bold" }}
          className="text-2xl text-rose-600"
        >
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Model Selection Dropdown */}
        <Dropdown
          label="Image Generation Model"
          options={modelOptions}
          selected={selectedModel}
          onSelect={handleModelChange}
          renderSelected={(option) => (
            <View className="flex-row justify-between items-center">
              <View>
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className="text-gray-800"
                >
                  {option?.label || "Select Model"}
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-gray-500 text-sm mt-1"
                >
                  {option?.description || "Choose an image generation model"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748b" />
            </View>
          )}
          renderOption={(option, isSelected) => (
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className={isSelected ? "text-rose-600" : "text-gray-800"}
                >
                  {option.label}
                </Text>
                {option.description && (
                  <Text
                    style={{ fontFamily: "Poppins_400Regular" }}
                    className="text-gray-500 text-sm"
                  >
                    {option.description}
                  </Text>
                )}
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={22} color="#e11d48" />
              )}
            </View>
          )}
        />

        {/* Theme Selection Dropdown */}
        <Dropdown
          label="App Theme"
          options={themeOptions}
          selected={selectedTheme}
          onSelect={handleThemeChange}
          renderSelected={(option) => (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                {option?.icon && (
                  <Ionicons
                    name={option.icon as any}
                    size={22}
                    color="#64748b"
                  />
                )}
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className="text-gray-800 ml-3"
                >
                  {option?.label || "Select Theme"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748b" />
            </View>
          )}
          renderOption={(option, isSelected) => (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                {option.icon && (
                  <Ionicons
                    name={option.icon as any}
                    size={22}
                    color="#64748b"
                  />
                )}
                <Text
                  style={{ fontFamily: "Poppins_500Medium" }}
                  className={`ml-3 ${
                    isSelected ? "text-rose-600" : "text-gray-800"
                  }`}
                >
                  {option.label}
                </Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={22} color="#e11d48" />
              )}
            </View>
          )}
        />

        {/* Pro Account Section */}
        <View className="mb-8 mt-5">
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className="text-lg text-gray-800 mb-3"
          >
            Pro Account
          </Text>

          <View className="bg-gray-50 rounded-xl p-4 flex-row justify-between items-center">
            <View className="flex-1">
              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className="text-gray-800"
              >
                Pro Features
              </Text>
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-500 text-sm"
              >
                Access premium models and features
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#cbd5e1", true: "#fecdd3" }}
              thumbColor={settings.isPro ? "#e11d48" : "#f4f4f5"}
              onValueChange={handleProStatusChange}
              value={settings.isPro}
            />
          </View>
        </View>

        {/* Reset Settings Button */}
        <TouchableOpacity
          className="bg-gray-100 rounded-xl p-4 flex-row justify-center items-center mb-8"
          onPress={handleResetSettings}
          disabled={isResetting}
        >
          <Ionicons name="refresh-outline" size={22} color="#e11d48" />
          <Text
            style={{ fontFamily: "Poppins_500Medium" }}
            className="text-rose-600 ml-2"
          >
            {isResetting ? "Resetting..." : "Reset to Default Settings"}
          </Text>
        </TouchableOpacity>

        {/* App Info Section */}
        <View className="mb-8 items-center">
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className="text-rose-600 text-xl mb-1"
          >
            Pragmatic
          </Text>
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-gray-500 text-sm"
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
