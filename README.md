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
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Authentication Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Enable Google Authentication:

   - Go to Authentication > Providers > Google
   - Enable Google provider
   - Create a new project in [Google Cloud Console](https://console.cloud.google.com)
   - Configure OAuth consent screen
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `[YOUR_SUPABASE_URL]/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase Google provider settings

4. Enable GitHub Authentication:

   - Go to Authentication > Providers > GitHub
   - Enable GitHub provider
   - Create a new OAuth App in [GitHub Developer Settings](https://github.com/settings/developers)
   - Set Homepage URL to your app's URL
   - Set Authorization callback URL: `[YOUR_SUPABASE_URL]/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase GitHub provider settings

5. Configure App URL Scheme:
   - Open app.json and add your URL scheme:
     ```json
     "expo": {
       "scheme": "wallpaper-app"
     }
     ```
   - Add the URL scheme to your OAuth provider settings

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
