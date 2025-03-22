import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, Animated } from "react-native";

interface LoadingStateManagerProps {
  isLoading: boolean;
}

// Array of interesting loading messages
const loadingMessages = [
  {
    title: "Creating your masterpiece...",
    subtitle: "Turning your words into beautiful pixels",
    icon: "sparkles-outline",
  },
  {
    title: "AI is painting...",
    subtitle: "Adding colors and textures to your vision",
    icon: "color-palette-outline",
  },
  {
    title: "Crafting details...",
    subtitle: "Making sure every pixel looks just right",
    icon: "brush-outline",
  },
  {
    title: "Almost there...",
    subtitle: "Putting the finishing touches on your wallpaper",
    icon: "image-outline",
  },
  {
    title: "Finalizing your creation...",
    subtitle: "Just a few more moments until your wallpaper is ready",
    icon: "checkmark-circle-outline",
  },
];

// Fun facts about AI art generation
const funFacts = [
  "Did you know? AI art models are trained on millions of images!",
  "Fun fact: The AI is generating your image pixel by pixel.",
  "Interesting! AI can combine different art styles in one image.",
  "Cool fact: This AI model has billions of parameters!",
  "Did you know? AI can create images that never existed before!",
];

export default function LoadingStateManager({
  isLoading,
}: LoadingStateManagerProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [showFact, setShowFact] = useState(false);

  // Animation values
  const shimmerOpacity = useRef(new Animated.Value(0.4)).current;
  const messageTranslateY = useRef(new Animated.Value(10)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const factOpacity = useRef(new Animated.Value(0)).current;
  const dot1TranslateY = useRef(new Animated.Value(0)).current;
  const dot2TranslateY = useRef(new Animated.Value(0)).current;
  const dot3TranslateY = useRef(new Animated.Value(0)).current;

  // Setup animations
  useEffect(() => {
    if (isLoading) {
      // Shimmer animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerOpacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerOpacity, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Dots animation
      const createDotAnimation = (value: Animated.Value) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: -10,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        );

      createDotAnimation(dot1TranslateY).start();
      setTimeout(() => createDotAnimation(dot2TranslateY).start(), 200);
      setTimeout(() => createDotAnimation(dot3TranslateY).start(), 400);
    }
  }, [isLoading]);

  // Handle message changes
  useEffect(() => {
    if (isLoading) {
      // Reset and start message animation
      messageTranslateY.setValue(10);
      messageOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(messageTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      const messageInterval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 5000);

      const factInterval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % funFacts.length);
        setShowFact(true);

        // Animate fact in
        Animated.timing(factOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Hide fact after 3 seconds
        setTimeout(() => {
          Animated.timing(factOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShowFact(false));
        }, 3000);
      }, 8000);

      return () => {
        clearInterval(messageInterval);
        clearInterval(factInterval);
      };
    }
  }, [isLoading, messageIndex]);

  if (!isLoading) return null;

  const currentMessage = loadingMessages[messageIndex];

  return (
    <View className="w-full h-full flex items-center justify-center relative">
      {/* Shimmer elements */}
      <Animated.View
        style={{ opacity: shimmerOpacity }}
        className="absolute top-0 left-0 right-0 h-1/4 rounded-t-3xl bg-white/40"
      />
      <Animated.View
        style={{ opacity: shimmerOpacity }}
        className="absolute bottom-0 left-0 right-0 h-1/4 rounded-b-3xl bg-white/40"
      />

      {/* Main content */}
      <View className="flex flex-col items-center px-6">
        <View className="text-[50px] text-rose-600">
          <Ionicons
            name={currentMessage.icon as any}
            size={50}
            color="#e11d48"
          />
        </View>

        <Animated.View
          style={{
            transform: [{ translateY: messageTranslateY }],
            opacity: messageOpacity,
          }}
          className="flex flex-col items-center mt-6"
        >
          <Text className="font-semibold text-gray-800 text-xl text-center">
            {currentMessage.title}
          </Text>
          <Text className="text-gray-500 text-center mt-2 px-4">
            {currentMessage.subtitle}
          </Text>
        </Animated.View>

        {/* Loading indicator */}
        <View className="flex flex-row items-center mt-8 space-x-2">
          <Animated.View
            style={{ transform: [{ translateY: dot1TranslateY }] }}
            className="w-3 h-3 bg-rose-400 rounded-full"
          />
          <Animated.View
            style={{ transform: [{ translateY: dot2TranslateY }] }}
            className="w-3 h-3 bg-rose-400 rounded-full"
          />
          <Animated.View
            style={{ transform: [{ translateY: dot3TranslateY }] }}
            className="w-3 h-3 bg-rose-400 rounded-full"
          />
        </View>

        {/* Fun fact pop-up */}
        {showFact && (
          <Animated.View
            style={{ opacity: factOpacity }}
            className="bg-white/90 px-4 py-3 rounded-xl mt-8 shadow-md"
          >
            <Text className="font-medium text-gray-700 text-sm text-center">
              {funFacts[factIndex]}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
