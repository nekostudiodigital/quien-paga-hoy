import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Appearance,
  ColorSchemeName,
  DeviceEventEmitter
} from "react-native";

type Scheme = NonNullable<ColorSchemeName>;
const STORAGE_KEY = "theme";
const systemScheme = () => (Appearance.getColorScheme() ?? "light") as Scheme;

export function useColorScheme(): Scheme {
  const [userScheme, setUserScheme] = useState<Scheme | null>(null);
  const [system, setSystem] = useState<Scheme>(systemScheme());

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const pref = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (pref === "light" || pref === "dark") {
          setUserScheme(pref);
        } else {
          setUserScheme(null);
        }
      } catch {
        setUserScheme(null);
      }
    };

    load();

    const appearanceSub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem((colorScheme ?? "light") as Scheme);
    });

    const configSub = DeviceEventEmitter.addListener("config:change", (cfg) => {
      if (cfg?.theme === "light" || cfg?.theme === "dark") {
        setUserScheme(cfg.theme);
      } else if (cfg?.theme === undefined) {
        // if theme removed, fall back to system
        setUserScheme(null);
      }
    });

    return () => {
      mounted = false;
      appearanceSub.remove();
      configSub.remove();
    };
  }, []);

  return userScheme ?? system;
}
