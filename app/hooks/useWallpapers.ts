import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Wallpaper } from "../types";

export const WALLPAPERS_STORAGE_KEY = "wallpapers";

export function useWallpapers() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallpapers();
  }, []);

  const loadWallpapers = async () => {
    try {
      setLoading(true);
      const savedWallpapers = await AsyncStorage.getItem(
        WALLPAPERS_STORAGE_KEY
      );
      if (savedWallpapers) {
        setWallpapers(JSON.parse(savedWallpapers));
      }
    } catch (error) {
      console.error("Error loading wallpapers:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveWallpaper = async (wallpaper: Wallpaper) => {
    try {
      const updatedWallpapers = [...wallpapers, wallpaper];
      await AsyncStorage.setItem(
        WALLPAPERS_STORAGE_KEY,
        JSON.stringify(updatedWallpapers)
      );
      setWallpapers(updatedWallpapers);
      return true;
    } catch (error) {
      console.error("Error saving wallpaper:", error);
      return false;
    }
  };

  const deleteWallpaper = async (id: string) => {
    try {
      const updatedWallpapers = wallpapers.filter(
        (wallpaper) => wallpaper.id !== id
      );
      await AsyncStorage.setItem(
        WALLPAPERS_STORAGE_KEY,
        JSON.stringify(updatedWallpapers)
      );
      setWallpapers(updatedWallpapers);
      return true;
    } catch (error) {
      console.error("Error deleting wallpaper:", error);
      return false;
    }
  };

  return {
    wallpapers,
    loading,
    loadWallpapers,
    saveWallpaper,
    deleteWallpaper,
  };
}
