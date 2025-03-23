import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import { AuthError } from "@supabase/supabase-js";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithEmail, loading, error } = useAuthContext();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      router.replace("/");
    } catch (err) {
      const error = err as AuthError;
      Alert.alert("Error", error.message || "An error occurred");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 justify-center">
        <View className="mb-8">
          <Text className="text-3xl text-rose-600 text-center font-bold mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-500 text-center">
            Sign in to continue to Pragmatic
          </Text>
        </View>

        <View className="space-y-4">
          <TextInput
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9ca3af"
          />

          <TextInput
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9ca3af"
          />

          {error && (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          )}

          <TouchableOpacity
            className="bg-rose-600 p-4 rounded-xl items-center"
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity className="items-center py-4">
              <Text className="text-rose-600">
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
