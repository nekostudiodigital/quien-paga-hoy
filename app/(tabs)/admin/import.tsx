import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../../components/app-header";
import { useAppStyles } from "../../styles";
import { useI18n } from "../../utils/i18n";

export default function ImportPage() {
  const { styles, isDark } = useAppStyles();
  const { t } = useI18n();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name?: string } | null>(null);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "*/*"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (!asset?.uri) {
        Alert.alert(t("import.error") as string, t("import.noFile") as string);
        return;
      }
      setSelectedFile({ uri: asset.uri, name: asset.name });
    } catch (err) {
      console.error("Pick file error:", err);
      Alert.alert(t("import.error") as string, t("import.noFile") as string);
    }
  };

  const doImport = async () => {
    try {
      if (!selectedFile?.uri) {
        Alert.alert(t("import.noFileTitle") as string, t("import.noFileMessage") as string);
        return;
      }

      const content = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== "object") throw new Error(t("import.error"));

      // Asegurarse de que claves y valores sean strings
      const entries = Object.entries(parsed).map(([k, v]) => [
        String(k),
        typeof v === "string" ? v : JSON.stringify(v),
      ]);

      console.log("Import -> entries count:", entries.length);
      await AsyncStorage.multiSet(entries);
      Alert.alert("Importado", "Datos importados correctamente");
    } catch (err: any) {
      console.error("Import error:", err);
      Alert.alert("Error", err?.message ? String(err.message) : "Error al importar (ver consola)");
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

            <Text style={styles.titulo}>{t("import.title")}</Text>
            <Text style={styles.texto}>{t("import.description")}</Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity style={styles.buttonExpImp} onPress={pickFile}>
                <Text style={styles.buttonExpImpText}>{t("import.pickButton")}</Text>
              </TouchableOpacity>
              <Text style={{ color: styles.input.color }}>
                {selectedFile?.name
                  ? t("import.selectedFile", { name: selectedFile.name })
                  : t("import.noFileSelected")}
              </Text>
            </View>
            {selectedFile?.uri ? (
              <View style={{ marginTop: 12 }}>
                <TouchableOpacity style={styles.buttonExpImp} onPress={doImport}>
                  <Text style={styles.buttonExpImpText}>{t("import.buttonFile")}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
