import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import { AuthError } from "@supabase/supabase-js";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const { signUp, loading, error } = useAuthContext();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    Keyboard.dismiss();
    try {
      await signUp(email, password);
      Alert.alert("Success", "Please check your email to verify your account", [
        {
          text: "OK",
          onPress: () => router.push("/"),
        },
      ]);
    } catch (err) {
      const error = err as AuthError;
      Alert.alert("Error", error.message || "An error occurred");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-rose-600 rounded-2xl items-center justify-center mb-4 shadow-lg">
            <Ionicons name="person-add" size={40} color="white" />
          </View>
          <Text
            className="text-4xl text-gray-800 text-center mb-3"
            style={{ fontFamily: "Poppins_700Bold" }}
          >
            Create Account
          </Text>
          <Text
            className="text-gray-500 text-center text-base max-w-[280px]"
            style={{ fontFamily: "Poppins_400Regular" }}
          >
            Sign up to start generating beautiful wallpapers
          </Text>
        </View>

        <View className="space-y-6">
          <View className="shadow-sm mb-6">
            <View
              className={`flex-row items-center bg-white rounded-2xl border ${
                isEmailFocused ? "border-rose-500" : "border-gray-100"
              }`}
              style={{
                shadowColor: isEmailFocused ? "#f43f5e" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="p-4">
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color={isEmailFocused ? "#f43f5e" : "#6b7280"}
                />
              </View>
              <TextInput
                className="flex-1 p-4 text-base text-gray-800"
                placeholder="Email"
                style={{ fontFamily: "Poppins_400Regular" }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </View>
          </View>

          <View className="shadow-sm mb-6">
            <View
              className={`flex-row items-center bg-white rounded-2xl border ${
                isPasswordFocused ? "border-rose-500" : "border-gray-100"
              }`}
              style={{
                shadowColor: isPasswordFocused ? "#f43f5e" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="p-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={isPasswordFocused ? "#f43f5e" : "#6b7280"}
                />
              </View>
              <TextInput
                className="flex-1 p-4 text-base text-gray-800"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9ca3af"
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <TouchableOpacity
                className="p-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={isPasswordFocused ? "#f43f5e" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          )}

          <TouchableOpacity
            className="shadow-lg"
            onPress={handleSignUp}
            disabled={loading}
            style={{
              shadowColor: "#f43f5e",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View
              className={`p-4 rounded-2xl items-center ${
                loading ? "bg-rose-400" : "bg-rose-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text
                  className="text-white font-semibold text-lg"
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  Sign Up
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center space-x-4 py-6">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text
              className="text-gray-400 text-sm mx-2"
              style={{ fontFamily: "Poppins_400Regular" }}
            >
              or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <View className="flex-row justify-center space-x-6">
            <TouchableOpacity
              className="w-14 h-14 bg-white rounded-full items-center mr-3 justify-center shadow-sm border border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Ionicons name="logo-github" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Link href="/" asChild>
            <TouchableOpacity className="items-center py-6">
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-gray-600 text-base"
              >
                Already have an account?{" "}
                <Text className="text-rose-600 font-semibold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
