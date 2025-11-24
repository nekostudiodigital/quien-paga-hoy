import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
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

export default function Control() {
  const { styles, isDark } = useAppStyles();
  const { t } = useI18n();
  const [nombre, setNombre] = useState("");
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [sugerencias, setSugerencias] = useState<Amigo[]>([]);
  const [seleccionado, setSeleccionado] = useState<Amigo | null>(null);

  // Cargar amigos al inicio
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

  // Predictivo + coincidencia exacta
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
      if (!exacto.historial) {
        exacto.historial = [];
      }

      setSeleccionado(exacto);
      setSugerencias([]);
      return;
    }

    // Filtrar por cualquier parte
    const coincidencias = amigos.filter((a) =>
      a.nombre.toLowerCase().includes(texto)
    );

    setSugerencias(coincidencias);
    setSeleccionado(null);
  }, [nombre, amigos]);

  const seleccionarSugerencia = (amigo: Amigo) => {
    setNombre(amigo.nombre);
    setSeleccionado(amigo);
    setSugerencias([]);
  };

  // Guardar nuevo pago en historial
  const guardarPago = async (quien: "YO" | "EL") => {
    if (!nombre.trim()) return;

    // Si la geolocalización tarda o no responde, seguimos guardando sin bloquear.
    const coords = await Promise.race<Coordenadas | null>([
      obtenerCoordenadas(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);

    const registro: RegistroPago = {
      pago: quien,
      fecha: new Date().toISOString(),
      ...(coords ? { coords } : {}),
    };

    const yaExiste = amigos.find((a) => a.nombre === nombre.trim());

    let amigoActualizado: Amigo;

    if (yaExiste) {
      // Añadir al historial
      amigoActualizado = {
        ...yaExiste,
        historial: [...yaExiste.historial, registro],
      };
    } else {
      // Crear amigo nuevo (solo en esta pantalla)
      amigoActualizado = {
        nombre: nombre.trim(),
        historial: [registro],
      };
    }

    // Actualizar lista
    const listaNueva = [
      ...amigos.filter((a) => a.nombre !== amigoActualizado.nombre),
      amigoActualizado,
    ];

    await AsyncStorage.setItem("amigos", JSON.stringify(listaNueva));

    setAmigos(listaNueva);
    setSeleccionado(amigoActualizado);
    setSugerencias([]);
  };

  const obtenerCoordenadas = async (): Promise<Coordenadas | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return null;

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: posicion.coords.latitude,
        longitude: posicion.coords.longitude,
        accuracy: posicion.coords.accuracy ?? null,
      };
    } catch (error) {
      // Si falla (sin permisos o error), seguimos guardando sin ubicación.
      return null;
    }
  };

  const puedeGuardar =
    nombre.trim() !== "" && (seleccionado !== null || sugerencias.length === 0);

  const background = isDark
    ? require("../../assets/images/bg-contactos-b.jpg")
    : require("../../assets/images/bg-contactos.jpg");

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
          <Text style={styles.titulo}>{t("control.title")}</Text>
          <Text style={styles.texto}>{t("control.text")}</Text>

          {/* INPUT */}
          <TextInput
            style={styles.input}
            placeholder={t("control.input")}
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />

          {/* SUGERENCIAS */}
          {sugerencias.length > 0 && (
            <View style={styles.sugerencias}>
              {sugerencias.map((a, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => seleccionarSugerencia(a)}
                >
                  <Text style={styles.sugerenciaItem}>{a.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* INFO ÚLTIMO PAGO */}
          {seleccionado && seleccionado.historial.length > 0 && (
            <View style={styles.infoBox}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.infoTexto}>
                  {t("control.lastPaid")} {" "}
                  <Text style={styles.bold}>
                    {seleccionado.historial[seleccionado.historial.length - 1].pago === "YO"
                      ? t("control.you")
                      : seleccionado.nombre}
                  </Text>
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    router.push(`/historial?nombre=${encodeURIComponent(seleccionado.nombre)}`);
                  }}
                >
                  <Ionicons name="chevron-forward-circle-outline" size={26} color="#7f8c8d" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.infoTexto, { marginTop: 8 }]}>
                {t("control.date")} {" "}
                {new Date(
                  seleccionado.historial[seleccionado.historial.length - 1].fecha
                ).toLocaleString()}
              </Text>
            </View>
          )}

          {/* NUEVO AMIGO */}
          {!seleccionado &&
            nombre.trim() !== "" &&
            sugerencias.length === 0 && (
              <Text style={styles.nuevo}>{t("control.newFriend")}</Text>
            )}

          {/* BOTONES */}
          {puedeGuardar && (
            <View style={styles.botones}>
              <TouchableOpacity
                style={[styles.boton, { backgroundColor: "#2980b9" }]}
                onPress={() => guardarPago("EL")}
              >
                <Text style={styles.botonTexto}>
                  {t("control.hePaysToday", {
                    name: (seleccionado?.nombre || nombre).trim(),
                  })}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boton, { backgroundColor: "#27ae60" }]}
                onPress={() => guardarPago("YO")}
              >
                <Text style={styles.botonTexto}>{t("control.iPayToday")}</Text>
              </TouchableOpacity>
            </View>
          )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
