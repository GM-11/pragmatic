import { Wallpaper } from "../types";
import Constants from "expo-constants";

interface GenerateParams {
  prompt: string;
  width?: number;
  height?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
}

/**
 * API client for interacting with the Hugging Face text-to-image model
 */

/**
 * Generates a wallpaper image using the Stable Diffusion model
 * @param prompt The text prompt for generating the image
 * @returns Promise with the base64 image data if successful
 */
export const generateWallpaperImage = async (
  prompt: string
): Promise<string> => {
  const model = "stabilityai/stable-diffusion-xl-base-1.0";
  // Using Hugging Face's Stable Diffusion API
  const modelUrl = `https://api-inference.huggingface.co/models/${model}`;

  // Get API key from Expo Constants instead of process.env
  const apiKey = process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Hugging Face API key is not defined. Please check your .env file."
    );
  }

  // Add quality prompt suffix to improve results
  const enhancedPrompt = `${prompt}, high quality, detailed, vibrant, 4k`;

  try {
    const response = await fetch(modelUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: {
          width: 768, // Reduced from 1080
          height: 1280, // Reduced from 1920
          num_inference_steps: 30, // Reduced from 50
          guidance_scale: 7.5, // Typical value for good quality
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Get the response as a blob
    const blob = await response.blob();

    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
    });

    reader.readAsDataURL(blob);
    return base64Promise;
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};

/**
 * Generates an edited version of an image based on the original prompt and edit instructions
 * @param originalPrompt The original text prompt that created the image
 * @param editInstructions New instructions for modifying the image
 * @returns Promise with the base64 image data if successful
 */
export const editWallpaperImage = async (
  originalPrompt: string,
  editInstructions: string
): Promise<string> => {
  // Combine the original prompt with the edit instructions for better context
  const combinedPrompt = `${originalPrompt}, ${editInstructions}`;
  return generateWallpaperImage(combinedPrompt);
};

export function createWallpaperObject(
  prompt: string,
  imageUrl: string
): Wallpaper {
  return {
    id: Date.now().toString(),
    prompt,
    imageUrl,
    createdAt: new Date().toISOString(),
  };
}
