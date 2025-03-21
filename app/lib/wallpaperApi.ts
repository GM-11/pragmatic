import { Wallpaper } from "../types";

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
  // Using Hugging Face's Stable Diffusion API
  const modelUrl =
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

  // Get API key from .env file
  const apiKey = process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Hugging Face API key is not defined. Please check your .env file."
    );
  }

  const response = await fetch(modelUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        width: 1080,
        height: 1920,
        num_inference_steps: 50,
        guidance_scale: 7.5,
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
