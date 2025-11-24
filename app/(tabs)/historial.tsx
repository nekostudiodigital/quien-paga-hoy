import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../components/app-header";
import { useAppStyles } from "../styles";
import { useI18n } from "../utils/i18n";

type Coordenadas = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

type RegistroPago = {
  pago: "YO" | "EL";
  fecha: string;
  coords?: Coordenadas;
};

type Amigo = {
  nombre: string;
  historial: RegistroPago[];
};

export const screenOptions = {
  headerShown: false,
};

export default function Historial() {
  const { styles, isDark } = useAppStyles();
  const { t } = useI18n();
  const [nombre, setNombre] = useState("");
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [sugerencias, setSugerencias] = useState<Amigo[]>([]);
  const [seleccionado, setSeleccionado] = useState<Amigo | null>(null);

  const { nombre: nombreParam } = useLocalSearchParams();

  // Cargar amigos
  useFocusEffect(
    React.useCallback(() => {
      async function cargar() {
        const data = await AsyncStorage.getItem("amigos");
        if (data) setAmigos(JSON.parse(data));
        else setAmigos([]);
      }
      cargar();
    }, [])
  );

  useEffect(() => {
    if (nombreParam) {
      setNombre(String(nombreParam));
    }
  }, [nombreParam]);

  // Predictivo
  useEffect(() => {
    const texto = nombre.trim().toLowerCase();

    if (!texto) {
      setSugerencias([]);
      setSeleccionado(null);
      return;
    }

    // Coincidencia exacta
    const exacto = amigos.find((a) => a.nombre.toLowerCase() === texto);

    if (exacto) {
      setSeleccionado(exacto);
      setSugerencias([]);
      return;
    }

    // Predictivo desde cualquier parte
    const coincidencias = amigos.filter((a) =>
      a.nombre.toLowerCase().includes(texto)
    );

    setSugerencias(coincidencias);
    setSeleccionado(null);
  }, [nombre, amigos]);

  const seleccionar = (amigo: Amigo) => {
    setNombre(amigo.nombre);
    setSeleccionado(amigo);
    setSugerencias([]);
  };

  const abrirMapa = async (coords?: Coordenadas) => {
    if (!coords) return;

    const { latitude, longitude } = coords;
    const apple = `http://maps.apple.com/?ll=${latitude},${longitude}`;
    const geo = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
    const web = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const url = Platform.OS === "ios" ? apple : geo;

    try {
      await Linking.openURL(url);
    } catch {
      Linking.openURL(web).catch(() => null);
    }
  };

  const background = isDark
    ? require("../../assets/images/bg-historial-b.jpg")
    : require("../../assets/images/bg-historial.jpg");

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
            <Text style={styles.titulo}>{t("history.title")}</Text>
            <Text style={styles.texto}>{t("history.text")}</Text>

            {/* INPUT */}
            <TextInput
              style={styles.input}
              placeholder={t("common.namePlaceholder")}
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />

            {/* SUGERENCIAS */}
            {sugerencias.length > 0 && (
              <View style={styles.sugerencias}>
                {sugerencias.map((a, i) => (
                  <TouchableOpacity key={i} onPress={() => seleccionar(a)}>
                    <Text style={styles.sugerenciaItem}>{a.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* HISTORIAL */}
            {seleccionado && (
              <View style={styles.historialBox}>
                <Text style={styles.historialTitulo}>
                  {t("history.of", { name: seleccionado.nombre })}
                </Text>

                {seleccionado.historial
                  .sort(
                    (a, b) =>
                      new Date(b.fecha).getTime() -
                      new Date(a.fecha).getTime()
                  )
                  .map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.linea,
                        { flexDirection: "row", alignItems: "center", gap: 8 }
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.lineaTexto}>
                          {item.pago === "YO"
                            ? t("history.youPaid")
                            : t("history.friendPaid", { name: seleccionado.nombre })}
                        </Text>
                        <Text style={styles.fecha}>
                          {new Date(item.fecha).toLocaleString()}
                        </Text>
                      </View>
                      {item.coords && (
                        <TouchableOpacity
                          onPress={() => abrirMapa(item.coords)}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            backgroundColor: "#3498db",
                            borderRadius: 6
                          }}
                        >
                          <Text style={{ color: "#fff", fontWeight: "600" }}>
                            {t("common.map")}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
              </View>
            )}

            {/* SI NO EXISTE */}
            {!seleccionado && nombre.trim() !== "" && sugerencias.length === 0 && (
              <Text style={styles.mensajeNoExiste}>
                {t("history.noFriend")}
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
