import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../../components/app-header";
import { useAppStyles } from "../../styles";
import { useI18n } from "../../utils/i18n";

export default function Ajustes() {
  const { styles, isDark } = useAppStyles();
  const { t } = useI18n();
  const router = useRouter();
  const [confirmar, setConfirmar] = useState(false);

  const borrarBD = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);

    setConfirmar(false);

    alert(t("delete.success"));
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

            <Text style={styles.titulo}>{t("delete.title")}</Text>
            <Text style={styles.texto}>{t("delete.text")}</Text>

            {/* BOTÓN PRINCIPAL */}
            {!confirmar && (
              <TouchableOpacity
                style={styles.botonRojo}
                onPress={() => setConfirmar(true)}
              >
                <Text style={styles.textoBoton}>
                  {t("settings.delete.title")}
                </Text>
              </TouchableOpacity>
            )}

            {/* CONFIRMACIÓN */}
            {confirmar && (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmTitulo}>
                  {t("delete.prompt")}
                </Text>

                <View style={styles.fila}>
                  <TouchableOpacity
                    style={styles.cancelar}
                    onPress={() => setConfirmar(false)}
                  >
                    <Text style={styles.textoCancelar}>{t("delete.cancel")}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmar}
                    onPress={borrarBD}
                  >
                    <Text style={styles.textoConfirmar}>{t("delete.confirm")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
