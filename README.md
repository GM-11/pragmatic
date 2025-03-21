# Pragmatic Wallpaper Generator

A mobile app that generates beautiful wallpapers using AI.

## Features

- Generate custom wallpapers using text prompts
- Save wallpapers to your gallery
- Browse and manage your wallpaper collection
- Download wallpapers to your device

## Tech Stack

- React Native with Expo
- TypeScript
- NativeWind (TailwindCSS for React Native)
- Hugging Face API for AI image generation
- Expo Router for navigation

## Project Structure

```
app/
├── components/              # UI components
│   ├── WallpaperDetail.tsx  # Detail view component
│   ├── WallpaperGrid.tsx    # Grid view component
│   ├── WallpaperPreview.tsx # Preview component
│   └── WallpaperTile.tsx    # Tile component for grid
├── hooks/                   # Custom hooks
│   └── useWallpapers.ts     # Wallpaper storage hook
├── lib/                     # External services
│   └── wallpaperApi.ts      # Hugging Face API integration
├── types/                   # TypeScript types
│   └── index.ts             # Shared interfaces
├── utils/                   # Utility functions
│   └── fileUtils.ts         # File download utilities
├── _layout.tsx              # Root layout with tab navigation
├── gallery.tsx              # Gallery screen
└── index.tsx                # Create screen
```

## Setup

1. Clone the repository
2. Install dependencies with `yarn install`
3. Create a `.env` file with your Hugging Face API key:
   ```
   EXPO_PUBLIC_HUGGINGFACE_API_KEY=your_api_key_here
   ```
4. Run the app with `yarn start`

## Environment Variables

- `EXPO_PUBLIC_HUGGINGFACE_API_KEY`: Your Hugging Face API key for Stable Diffusion

## License

MIT

<p>
  <!-- iOS -->
  <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <!-- Android -->
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
  <!-- Web -->
  <img alt="Supports Expo Web" longdesc="Supports Expo Web" src="https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff" />
</p>

## 🚀 How to use

<!-- Setup instructions -->

- Install with `yarn` or `npm install`.
- Run `yarn start` or `npm run start` to try it out.

## 📝 Notes

<!-- Link to related Expo or library docs -->

- This example replicates the [NativeWind Expo Router setup instructions](https://www.nativewind.dev/getting-started/expo-router) for NativeWind v4.
