import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../../components/app-header";
import { useAppStyles } from "../../styles";
import { useI18n } from "../../utils/i18n";

export default function LanguagesPage() {
  const { styles, isDark } = useAppStyles();
  const { t, setLanguage, lang } = useI18n();
  const router = useRouter();
  const [current, setCurrent] = useState(lang);

  useEffect(() => {
    setCurrent(lang);
  }, [lang]);

  const choose = async (l: "es" | "en" | "pt") => {
    setCurrent(l);
    await setLanguage(l);
  };

  const names: Record<string, string> = {
    es: t("languages.es"),
    en: t("languages.en"),
    pt: t("languages.pt"),
  };

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
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
              onPress={() => router.push("/admin")}>
              <Ionicons name="arrow-back" size={22} color={styles.titulo.color} />
            </TouchableOpacity>

            <Text style={styles.titulo}>{t("languages.title")}</Text>
            <Text style={styles.texto}>{t("languages.text")}</Text>
            {["es", "en", "pt"].map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => choose(l as any)}
                style={[styles.langButton, current === l && styles.langButtonActive]}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    current === l && styles.langButtonTextActive,
                  ]}
                >
                  {names[l]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
