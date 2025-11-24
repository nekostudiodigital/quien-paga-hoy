import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../../components/app-header";
import { useAppStyles } from "../../styles";
import { useI18n } from "../../utils/i18n";

export const screenOptions = {
  title: "Ajustes", // se reemplaza visualmente con traducciones
  headerShown: false,
};

export default function Ajustes() {
  const { styles, isDark } = useAppStyles();
  const { t, lang } = useI18n();
  const router = useRouter();

  const [language, setLanguage] = useState(lang);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("language");
        if (stored) setLanguage(stored);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    setLanguage(lang);
  }, [lang]);

  const options = useMemo(
    () => [
      {
        title: t("settings.export.title"),
        subtitle: t("settings.export.subtitle"),
        onPress: () => router.push("/admin/export"),
      },
      {
        title: t("settings.import.title"),
        subtitle: t("settings.import.subtitle"),
        onPress: () => router.push("/admin/import"),
      },
      {
        title: t("settings.theme.title"),
        subtitle: t("settings.theme.subtitle"),
        onPress: () => router.push("/admin/theme"),
      },
      {
        title: t("settings.language.title"),
        subtitle: t("settings.language.subtitle", { lang: language }),
        onPress: () => router.push("/admin/languages"),
      },
      {
        title: t("settings.delete.title"),
        subtitle: t("settings.delete.subtitle"),
        onPress: () => router.push("/admin/delete"),
        danger: true,
      },
      {
        title: t("settings.about.title"),
        subtitle: t("settings.about.subtitle"),
        onPress: () => router.push("/admin/about"),
      },
    ],
    [language, router, t]
  );

  const background = isDark
    ? require("../../../assets/images/bg-settings-b.jpg")
    : require("../../../assets/images/bg-settings.jpg");

  return (
    <ImageBackground
      source={background}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: "transparent" }]}>
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppHeader />
          <View style={styles.sectionCard}>
            <Text style={styles.titulo}>{t("settings.title")}</Text>

            <View style={{ marginTop: 16, gap: 12 }}>
              {options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    padding: 16,
                    backgroundColor: styles.container.backgroundColor,
                    borderRadius: 8,
                    elevation: 2,
                  }}
                  onPress={option.onPress}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color: option.danger ? "#b00020" : styles.titulo.color,
                    }}
                  >
                    {option.title}
                  </Text>
                  <Text style={{ color: "#666", marginTop: 6 }}>{option.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
