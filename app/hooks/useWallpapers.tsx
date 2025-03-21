import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Wallpaper } from "../types";

export const useWallpapers = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved wallpapers when component mounts
    loadWallpapers();
  }, []);

  const loadWallpapers = async () => {
    setLoading(true);
    try {
      const savedWallpapers = await AsyncStorage.getItem("wallpapers");
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
      const newWallpapers = [wallpaper, ...wallpapers];
      await AsyncStorage.setItem("wallpapers", JSON.stringify(newWallpapers));
      setWallpapers(newWallpapers);
      return true;
    } catch (error) {
      console.error("Error saving wallpaper:", error);
      return false;
    }
  };

  const deleteWallpaper = async (id: string) => {
    try {
      const newWallpapers = wallpapers.filter((wp) => wp.id !== id);
      await AsyncStorage.setItem("wallpapers", JSON.stringify(newWallpapers));
      setWallpapers(newWallpapers);
      return true;
    } catch (error) {
      console.error("Error deleting wallpaper:", error);
      return false;
    }
  };

  return {
    wallpapers,
    loading,
    saveWallpaper,
    deleteWallpaper,
    refreshWallpapers: loadWallpapers,
  };
};
