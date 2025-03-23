import { Stack } from "expo-router";
import { View, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, useTheme } from "../hooks/useTheme";
import { AuthProvider, useAuthContext } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutContent onLayoutRootView={onLayoutRootView} />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootLayoutContent({
  onLayoutRootView,
}: {
  onLayoutRootView: () => void;
}) {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuthContext();

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
    >
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Redirect based on authentication status */}
        <Stack.Screen name="index" redirect={true} />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      {isAuthenticated ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/(auth)" />
      )}
    </View>
  );
}
