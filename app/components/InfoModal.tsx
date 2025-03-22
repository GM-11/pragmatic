import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={{ fontFamily: "Poppins_700Bold", ...styles.title }}>
              About Pragmatic
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#e11d48" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  ...styles.sectionTitle,
                }}
              >
                App Description
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  ...styles.paragraph,
                }}
              >
                Pragmatic is a wallpaper generation app that turns your text
                descriptions into beautiful AI-generated wallpapers for your
                device. Simply type in a description of what you envision, and
                watch Pragmatic create stunning art tailored to your
                smartphone's dimensions.
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  ...styles.sectionTitle,
                }}
              >
                AI Technology
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  ...styles.paragraph,
                }}
              >
                Pragmatic uses Stability AI's Stable Diffusion XL model via
                Hugging Face API to generate images. Stable Diffusion is a
                state-of-the-art text-to-image model that can create
                photorealistic images based on text descriptions.
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  ...styles.sectionTitle,
                }}
              >
                Developer
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  ...styles.paragraph,
                }}
              >
                This app was developed as a demonstration project to showcase
                the capabilities of AI-powered image generation in mobile
                applications. It combines React Native, Expo, and modern UX
                principles with Hugging Face's API services.
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={{
                  fontFamily: "Poppins_600SemiBold",
                  ...styles.sectionTitle,
                }}
              >
                Usage Tips
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  ...styles.paragraph,
                }}
              >
                For best results, be specific in your descriptions. Include
                details about style (e.g., "watercolor", "photorealistic"),
                subject matter, colors, mood, and composition. The more detailed
                your prompt, the better the AI can match your vision.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() =>
                Linking.openURL(
                  "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0"
                )
              }
            >
              <Text
                style={{ fontFamily: "Poppins_600SemiBold", color: "#fff" }}
              >
                Learn More About Stable Diffusion
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    color: "#e11d48",
  },
  closeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#fce7f3",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: "#1f2937",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
  },
  linkButton: {
    backgroundColor: "#e11d48",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
});
