import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, useWindowDimensions } from "react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

// Import your global CSS file
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Call onLayoutRootView when the layout is ready
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "#e5e7eb",
            height: 60,
            elevation: 0,
            shadowOpacity: 0.1,
          },
          tabBarActiveTintColor: "#e11d48", // rose-600
          tabBarInactiveTintColor: "#9ca3af", // gray-400
          tabBarShowLabel: false, // Hide the tab labels
          headerShown: false,
          tabBarItemStyle: {
            paddingVertical: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="create-outline" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="gallery"
          options={{
            title: "Gallery",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
