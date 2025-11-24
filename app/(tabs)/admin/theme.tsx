import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ImageBackground, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../../components/app-header";
import { useAppStyles } from "../../styles";
import { saveConfig } from "../../utils/config";
import { useI18n } from "../../utils/i18n";

export default function ThemePage() {
  const { styles, isDark } = useAppStyles();
  const { t } = useI18n();
  const router = useRouter();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("theme");
      setDark(t === "dark");
    })();
  }, []);

  const toggle = async (val: boolean) => {
    setDark(val);
    const theme = val ? "dark" : "light";
    await AsyncStorage.setItem("theme", theme);
    await saveConfig({ theme });
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

            <Text style={styles.titulo}>{t("theme.title")}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.texto}>{t("theme.toggle")}</Text>
              <Switch value={dark} onValueChange={toggle} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
