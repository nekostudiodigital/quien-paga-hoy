import React from "react";
import { Text, View } from "react-native";

import { useAppStyles } from "../app/styles";

const APP_NAME = "¿Quien paga hoy?";

export default function AppHeader({ title }: { title?: string }) {
  const { colors, isDark } = useAppStyles();
  const overlay = isDark ? "rgba(200,200,200)" : "rgba(100,100,100)";
  const textColor = isDark ? "#444" : "#FFF";

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: overlay,
        marginBottom: 22,
        height: 60,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "800", color: textColor, textAlign: "center" }}>
        {title || APP_NAME}
      </Text>
    </View>
  );
}
