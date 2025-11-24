import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React from "react";
import { Alert, ImageBackground, Platform, ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../../components/app-header";
import { useAppStyles } from "../../styles";
import { useI18n } from "../../utils/i18n";

export default function ExportPage() {
  const { styles, isDark } = useAppStyles();
  const { t } = useI18n();
  const router = useRouter();

  const doExport = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      const obj = Object.fromEntries(items);
      const backup = JSON.stringify(obj, null, 2);

      const fileName = `quienpaga-backup-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.qph`;
      const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? "";
      const fileUri = `${baseDir}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, backup, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const sharingAvailable = await Sharing.isAvailableAsync();
      if (sharingAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: t("export.shareDialog") as string,
        });
      } else {
        // Fallback: intenta compartir el path si el sistema no soporta expo-sharing (por ejemplo web)
        await Share.share({
          url: fileUri,
          message:
            Platform.OS === "web"
              ? t("export.shareFallbackWeb", { path: fileUri }) || fileUri
              : t("export.shareFallbackNative") || fileUri,
        });
      }
    } catch (e) {
      console.error("Export error:", e);
      Alert.alert(t("export.errorTitle") as string, t("export.errorMessage") as string);
    }
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

            <Text style={styles.titulo}>{t("export.title")}</Text>
            <Text style={styles.texto}>{t("export.text")}</Text>
            <TouchableOpacity style={styles.buttonExpImp} onPress={doExport}>
              <Text style={styles.buttonExpImpText}>{t("export.button")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
