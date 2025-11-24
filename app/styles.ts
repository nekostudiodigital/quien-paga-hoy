import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { Colors } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    // ======== PAGINAS GLOBALES
    container: {
      flex: 1,
      padding: 0,
      paddingBottom: 10,
      backgroundColor: palette.background,
    },
    sectionCard: {
      padding: 16,
      paddingBottom: 40,
      backgroundColor: "transparent",
      flexGrow: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
      backgroundColor: "transparent",
      flexGrow: 1,
    },
    titulo: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      color: palette.text,
    },
    texto: {
      fontSize: 16,
      fontWeight: "normal",
      marginBottom: 20,
      color: palette.text,
    },
    bold: {
      fontWeight: "bold",
      color: palette.text,
    },
    h2: {
      fontSize: 22,
      fontWeight: "bold",
      color: palette.text,
    },
    input: {
      borderWidth: 1,
      borderColor: palette.icon,
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      fontSize: 16,
      color: palette.text,
      backgroundColor: palette.background,
    },

    // ======== CONTROL ========
    sugerencias: {
      backgroundColor: palette.background,
      borderWidth: 1,
      borderColor: palette.icon,
      borderRadius: 8,
      marginBottom: 20,
    },
    sugerenciaItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderColor: palette.icon,
      fontSize: 16,
      color: palette.text,
    },
    infoBox: {
      backgroundColor: palette.background === Colors.dark.background ? "#1f2223" : "#f5f5f5",
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
    },
    infoTexto: {
      fontSize: 16,
      color: palette.text,
    },

    nuevo: {
      color: palette.icon,
      marginBottom: 20,
      fontStyle: "italic",
    },
    botones: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    boton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    botonTexto: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      textAlign: "center",
    },
    botonHistorial: {
      backgroundColor: "#8e44ad",
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
    },
    botonHistorialTexto: {
      color: "white",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
    },

    // ======== HISTORIAL ========
    historialBox: {
      marginTop: 10,
      backgroundColor: palette.background === Colors.dark.background ? "#1f2223" : "#f7f7f7",
      borderRadius: 10,
      padding: 15,
    },
    historialTitulo: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: "bold",
      color: palette.text,
    },
    linea: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: palette.icon,
    },
    lineaTexto: {
      fontSize: 16,
      color: palette.text,
    },
    fecha: {
      color: palette.icon,
      fontSize: 14,
    },
    mensajeNoExiste: {
      color: palette.icon,
      marginTop: 15,
      fontStyle: "italic",
    },

    // ======== ADMIN ========
    botonRojo: {
      backgroundColor: "#e74c3c",
      padding: 15,
      borderRadius: 10,
    },
    textoBoton: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 18,
    },

    confirmBox: {
      backgroundColor: palette.background === Colors.dark.background ? "#1f2223" : "#f8f8f8",
      padding: 20,
      borderRadius: 10,
    },
    confirmTitulo: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "center",
      color: palette.text,
    },

    fila: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    cancelar: {
      flex: 1,
      backgroundColor: "#bdc3c7",
      padding: 12,
      borderRadius: 10,
      marginRight: 10,
    },
    textoCancelar: {
      color: "#2c3e50",
      fontWeight: "bold",
      textAlign: "center",
    },

    confirmar: {
      flex: 1,
      backgroundColor: "#c0392b",
      padding: 12,
      borderRadius: 10,
      marginLeft: 10,
    },
    textoConfirmar: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    buttonExpImp: {
      backgroundColor: "#2980b9",
      paddingVertical: 30,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
    buttonExpImpText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    langButton: {
      backgroundColor: palette.background === Colors.dark.background ? "#1f2b38" : "#ecf0f1",
      borderWidth: 1,
      borderColor: palette.icon,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 12,
      marginTop: 10,
    },
    langButtonActive: {
      borderColor: "#2980b9",
      backgroundColor: palette.background === Colors.dark.background ? "#223447" : "#d6eaf8",
    },
    langButtonText: {
      color: palette.text,
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    langButtonTextActive: {
      color: "#2980b9",
      fontWeight: "700",
    },
  });

export function useAppStyles() {
  const scheme = useColorScheme();
  const palette = scheme === "dark" ? Colors.dark : Colors.light;
  const styles = useMemo(() => createStyles(palette), [palette]);

  return { styles, colors: palette, isDark: scheme === "dark" };
}

export const lightStyles = createStyles(Colors.light);
export const darkStyles = createStyles(Colors.dark);
export default lightStyles;
