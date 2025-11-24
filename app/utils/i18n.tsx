import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { saveConfig } from "./config";

export type Lang = "es" | "en" | "pt";

const translations: Record<Lang, Record<string, string>> = {
  es: {
    "control.title": "¿Con quién estás?",
    "control.text": "Busca o añade la persona con la que has tomado algo para ver a quien le toca invitar",
    "control.input": "Escribe un nombre...",
    "control.lastPaid": "Última vez pagó:",
    "control.date": "Fecha:",
    "control.newFriend": "Nuevo amigo. No hay registros.",
    "control.hePaysToday": "Hoy paga\n{{name}}",
    "control.iPayToday": "Hoy pago\nYO",
    "control.you": "Tú",

    "history.title": "Historial de Pagos",
    "history.text": "Busca a la persona para ver todo vuestro historial de invitaciones",
    "history.of": "Historial de {{name}}",
    "history.youPaid": "Tú pagaste",
    "history.friendPaid": "{{name}} pagó",
    "history.noFriend": "Ese amigo no existe en la base de datos.",

    "common.namePlaceholder": "Escribe un nombre...",
    "common.map": "Mapa",
    "common.back": "Atrás",

    "settings.title": "Ajustes",
    "settings.export.title": "Exportar datos y configuración",
    "settings.export.subtitle": "Crear o importa tu backup",
    "settings.import.title": "Importar datos y configuración",
    "settings.import.subtitle": "Crear o importa tu backup",
    "settings.theme.title": "Modo oscuro",
    "settings.theme.subtitle": "Cambiar preferencias de tema",
    "settings.language.title": "Idioma",
    "settings.language.subtitle": "Idioma actual: {{lang}}",
    "settings.delete.title": "Borrar base de datos",
    "settings.delete.subtitle": "Eliminar todos los datos guardados",
    "settings.about.title": "Acerca de",
    "settings.about.subtitle": "Créditos y versión de la app",

    "theme.title": "Modo oscuro",
    "theme.toggle": "Activar tema oscuro",

    "languages.title": "Idioma",
    "languages.text": "Selecciona tu idioma",
    "languages.es": "Español",
    "languages.en": "English",
    "languages.pt": "Português",

    "export.title": "Exportar datos",
    "export.text": "Exporta todo el historial de amigos para tener una copia de seguridad",
    "export.button": "Generar y compartir .qph",
    "export.shareDialog": "Exportar backup (.qph)",
    "export.shareFallbackWeb": "Guarda este archivo .qph: {{path}}",
    "export.shareFallbackNative": "Compartí o guardá el archivo .qph.",
    "export.errorTitle": "Error",
    "export.errorMessage": "No se pudo exportar el backup",

    "import.title": "Importar datos",
    "import.placeholder": "Pega aquí el JSON exportado",
    "import.error": "JSON no es un objeto válido",
    "import.button": "Importar",
    "import.description": "Selecciona el archivo .qph generado para restaurar tus datos.",
    "import.pickButton": "Elegir archivo .qph",
    "import.selectedFile": "Archivo seleccionado: {{name}}",
    "import.noFileSelected": "Aún no seleccionaste ningún archivo.",
    "import.noFileTitle": "Falta archivo",
    "import.noFileMessage": "Primero selecciona un archivo .qph para importar.",
    "import.noFile": "No se pudo leer el archivo",
    "import.buttonFile": "Importar archivo",

    "delete.title": "Borrar los datos",
    "delete.text": "¡CUIDADO!\nElimina los historiales y los nombres de tus amigos",
    "delete.prompt": "¿Seguro que quieres borrar la base de datos?",
    "delete.cancel": "Cancelar",
    "delete.confirm": "Sí, borrar",
    "delete.success": "Base de datos borrada correctamente",

    "about.title": "Acerca de",
    "about.text": "Creado por Hobbinek. 2025",
      },
  en: {
    "control.title": "Who are you with?",
    "control.text": "Find or add the person you had a drink with to see whose turn it is to pay.",
    "control.input": "Type a name...",
    "control.lastPaid": "Last paid:",
    "control.date": "Date:",
    "control.newFriend": "New friend. No records yet.",
    "control.hePaysToday": "Pays today\n{{name}}",
    "control.iPayToday": "I pay\ntoday",
    "control.you": "You",

    "history.title": "Payment History",
    "history.text": "Search for the person to see your entire invitation history",
    "history.of": "History of {{name}}",
    "history.youPaid": "You paid",
    "history.friendPaid": "{{name}} paid",
    "history.noFriend": "That friend is not in the database.",

    "common.namePlaceholder": "Type a name...",
    "common.map": "Map",
    "common.back": "Back",

    "settings.title": "Settings",
    "settings.export.title": "Export data & config",
    "settings.export.subtitle": "Create or import your backup",
    "settings.import.title": "Import data & config",
    "settings.import.subtitle": "Create or import your backup",
    "settings.theme.title": "Dark mode",
    "settings.theme.subtitle": "Change theme preferences",
    "settings.language.title": "Language",
    "settings.language.subtitle": "Current language: {{lang}}",
    "settings.delete.title": "Delete database",
    "settings.delete.subtitle": "Remove all saved data",
    "settings.about.title": "About",
    "settings.about.subtitle": "App credits and version",

    "theme.title": "Dark mode",
    "theme.toggle": "Enable dark theme",

    "languages.title": "Language",
    "languages.text": "Select your language",
    "languages.es": "Spanish",
    "languages.en": "English",
    "languages.pt": "Portuguese",

    "export.title": "Export data",
    "export.text": "Export your entire friends history to create a backup.",
    "export.button": "Generate and share .qph",
    "export.shareDialog": "Export backup (.qph)",
    "export.shareFallbackWeb": "Save this .qph file: {{path}}",
    "export.shareFallbackNative": "Share or save the .qph file.",
    "export.errorTitle": "Error",
    "export.errorMessage": "Could not export backup",

    "import.title": "Import data",
    "import.placeholder": "Paste the exported JSON here",
    "import.error": "JSON is not a valid object",
    "import.button": "Import",
    "import.description": "Pick the generated .qph file to restore your data.",
    "import.pickButton": "Choose .qph file",
    "import.selectedFile": "Selected file: {{name}}",
    "import.noFileSelected": "No file selected yet.",
    "import.noFileTitle": "File missing",
    "import.noFileMessage": "Select a .qph file before importing.",
    "import.noFile": "Could not read the file",
    "import.buttonFile": "Import file",

    "delete.title": "Delete data",
    "delete.text": "CAUTION: Deletes browsing history and friends' names",
    "delete.prompt": "Are you sure you want to delete the database?",
    "delete.cancel": "Cancel",
    "delete.confirm": "Yes, delete",
    "delete.success": "Database deleted successfully",

    "about.title": "About",
    "about.text": "Created by Hobbinek. 2025",
      },
  pt: {
    "control.title": "Com quem você está?",
    "control.text": "Encontre ou adicione a pessoa com quem bebeu um copo para ver de quem é a vez de pagar.",
    "control.input": "Digite um nome...",
    "control.lastPaid": "Último pagamento:",
    "control.date": "Data:",
    "control.newFriend": "Novo amigo. Sem registros.",
    "control.hePaysToday": "Hoje paga\n{{name}}",
    "control.iPayToday": "Hoje eu pago\nEU",
    "control.you": "Você",

    "history.title": "Histórico de Pagamentos",
    "history.text": "Procure a pessoa para ver todo o seu histórico de convites.",
    "history.of": "Histórico de {{name}}",
    "history.youPaid": "Você pagou",
    "history.friendPaid": "{{name}} pagou",
    "history.noFriend": "Esse amigo não está na base de dados.",

    "common.namePlaceholder": "Digite um nome...",
    "common.map": "Mapa",
    "common.back": "Voltar",

    "settings.title": "Ajustes",
    "settings.export.title": "Exportar dados e configuração",
    "settings.export.subtitle": "Crie ou importe seu backup",
    "settings.import.title": "Importar dados e configuração",
    "settings.import.subtitle": "Crie ou importe seu backup",
    "settings.theme.title": "Modo escuro",
    "settings.theme.subtitle": "Alterar preferências de tema",
    "settings.language.title": "Idioma",
    "settings.language.subtitle": "Idioma atual: {{lang}}",
    "settings.delete.title": "Apagar base de dados",
    "settings.delete.subtitle": "Remover todos os dados salvos",
    "settings.about.title": "Sobre",
    "settings.about.subtitle": "Créditos e versão da aplicação",

    "theme.title": "Modo escuro",
    "theme.toggle": "Ativar tema escuro",

    "languages.title": "Idioma",
    "languages.text": "Selecione o seu idioma",
    "languages.es": "Espanhol",
    "languages.en": "Inglês",
    "languages.pt": "Português",

    "export.title": "Exportar dados",
    "export.text": "Exporte todo o histórico dos seus amigos para criar um backup.",
    "export.button": "Gerar e compartilhar .qph",
    "export.shareDialog": "Exportar backup (.qph)",
    "export.shareFallbackWeb": "Salve este arquivo .qph: {{path}}",
    "export.shareFallbackNative": "Compartilhe ou salve o arquivo .qph.",
    "export.errorTitle": "Erro",
    "export.errorMessage": "Não foi possível exportar o backup",

    "import.title": "Importar dados",
    "import.placeholder": "Cole aqui o JSON exportado",
    "import.error": "JSON não é um objeto válido",
    "import.button": "Importar",
    "import.description": "Selecione o arquivo .qph gerado para restaurar seus dados.",
    "import.pickButton": "Escolher arquivo .qph",
    "import.selectedFile": "Arquivo selecionado: {{name}}",
    "import.noFileSelected": "Nenhum arquivo selecionado ainda.",
    "import.noFileTitle": "Arquivo faltando",
    "import.noFileMessage": "Selecione um arquivo .qph antes de importar.",
    "import.noFile": "Não foi possível ler o arquivo",
    "import.buttonFile": "Importar arquivo",

    "delete.title": "Apagar dados",
    "delete.text": "ATENÇÃO: Apaga o histórico de navegação e os nomes dos amigos.",
    "delete.prompt": "Tem certeza que deseja apagar a base de dados?",
    "delete.cancel": "Cancelar",
    "delete.confirm": "Sim, apagar",
    "delete.success": "Base de dados apagada com sucesso",

    "about.title": "Sobre",
    "about.text": "Criado por Hobbinek. 2025",
  },
};

const I18nContext = createContext({
  lang: "es" as Lang,
  t: (key: string, vars?: Record<string, string | number>) => key,
  setLanguage: async (_lang: Lang) => {},
});

const STORAGE_KEY = "language";

function applyVars(text: string, vars?: Record<string, string | number>) {
  if (!vars) return text;
  return Object.entries(vars).reduce((acc, [k, v]) => {
    return acc.replace(new RegExp(`{{${k}}}`, "g"), String(v));
  }, text);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "es" || stored === "en" || stored === "pt") {
          setLang(stored);
        }
      } catch {}
    })();
  }, []);

  const setLanguage = async (next: Lang) => {
    setLang(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
    await saveConfig({ language: next });
  };

  const value = useMemo(
    () => ({
      lang,
      setLanguage,
      t: (key: string, vars?: Record<string, string | number>) => {
        const table = translations[lang] || translations.es;
        const fallback = translations.es;
        const text = table[key] ?? fallback[key] ?? key;
        return applyVars(text, vars);
      },
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
