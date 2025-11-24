import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

type Config = {
  theme?: string;
  language?: string;
};

export const saveConfig = async (partial: Config) => {
  try {
    const existing = await AsyncStorage.getItem("configuracion");
    const current: Config = existing ? JSON.parse(existing) : {};
    const updated = { ...current, ...partial };
    await AsyncStorage.setItem("configuracion", JSON.stringify(updated));
    DeviceEventEmitter.emit("config:change", updated);
  } catch {
    // ignore persistence errors to avoid blocking UI
  }
};
