import { Wallpaper } from "../types";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, ImageModel } from "../hooks/useSettings";

const SETTINGS_STORAGE_KEY = "pragmatic_app_settings";

// Model mapping for Hugging Face API
const MODEL_MAPPING: Record<ImageModel, string> = {
  "sd-xl-base": "stabilityai/stable-diffusion-xl-base-1.0",
  "sd-v1-5": "runwayml/stable-diffusion-v1-5",
  "sd-3-5-large": "stabilityai/stable-diffusion-3-5-large",
  "flux-1-dev": "black-forest-labs/FLUX.1-dev",
};

// Model specific parameters
interface ModelParams {
  steps: number;
  guidance: number;
  sampler?: string;
}

// Parameters optimized for each model
const MODEL_PARAMS: Record<ImageModel, ModelParams> = {
  "sd-xl-base": {
    steps: 30,
    guidance: 7.5,
  },
  "sd-v1-5": {
    steps: 25,
    guidance: 7.0,
  },
  "sd-3-5-large": {
    steps: 40,
    guidance: 5.0,
    sampler: "LCM",
  },
  "flux-1-dev": {
    steps: 35,
    guidance: 4.0,
  },
};

// Gets the currently selected model from settings
const getSelectedModel = async (): Promise<{
  modelId: string;
  params: ModelParams;
  imageModel: ImageModel;
}> => {
  try {
    const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      const settings: AppSettings = JSON.parse(storedSettings);

      // Check if user is trying to use a Pro model without Pro access
      if (
        !settings.isPro &&
        (settings.imageModel === "sd-3-5-large" ||
          settings.imageModel === "flux-1-dev")
      ) {
        // Fall back to a free model
        return {
          modelId: MODEL_MAPPING["sd-xl-base"],
          params: MODEL_PARAMS["sd-xl-base"],
          imageModel: "sd-xl-base",
        };
      }

      return {
        modelId: MODEL_MAPPING[settings.imageModel],
        params: MODEL_PARAMS[settings.imageModel],
        imageModel: settings.imageModel,
      };
    }
  } catch (error) {
    console.error("Error loading model settings:", error);
  }

  // Default model if settings can't be loaded
  return {
    modelId: MODEL_MAPPING["sd-xl-base"],
    params: MODEL_PARAMS["sd-xl-base"],
    imageModel: "sd-xl-base",
  };
};

// Generates a wallpaper image using the selected Stable Diffusion model
export const generateWallpaperImage = async (
  prompt: string
): Promise<string> => {
  // Get the selected model and its parameters from settings
  const { modelId, params, imageModel } = await getSelectedModel();

  // Using Hugging Face's API
  const modelUrl = `https://api-inference.huggingface.co/models/${modelId}`;

  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Hugging Face API key is not defined. Please check your environment variables."
    );
  }

  // Add quality prompt suffix to improve results - tailor to model
  let enhancedPrompt = prompt;
  if (imageModel === "sd-v1-5" || imageModel === "sd-xl-base") {
    enhancedPrompt = `${prompt}, high quality, detailed, vibrant, 4k`;
  } else if (imageModel === "sd-3-5-large") {
    enhancedPrompt = `${prompt}, highly detailed, high resolution wallpaper`;
  } else if (imageModel === "flux-1-dev") {
    enhancedPrompt = `${prompt}, masterpiece, highly detailed wallpaper, sharp focus`;
  }

  try {
    const requestBody: any = {
      inputs: enhancedPrompt,
      parameters: {
        width: 768,
        height: 1280,
        num_inference_steps: params.steps,
        guidance_scale: params.guidance,
      },
    };

    // Add sampler if specified
    if (params.sampler) {
      requestBody.parameters.sampler = params.sampler;
    }

    const response = await fetch(modelUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
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
