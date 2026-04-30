import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { C } from "../constants/colors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: C.primary,
    secondary: C.accent,
    background: C.bg,
    surface: C.surface,
    onPrimary: C.headerText,
  },
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor={C.headerBg} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: C.headerBg },
            headerTintColor: C.headerText,
            headerTitleStyle: { fontWeight: "bold" },
            contentStyle: { backgroundColor: C.bg },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="sobre" options={{ title: "Sobre o App" }} />
          <Stack.Screen name="usuario/[id]/curriculo" options={{ title: "Currículo Completo" }} />
          <Stack.Screen name="usuario/[id]/academica" options={{ title: "Experiência Acadêmica" }} />
          <Stack.Screen name="usuario/[id]/profissional" options={{ title: "Experiência Profissional" }} />
          <Stack.Screen name="usuario/[id]/projetos" options={{ title: "Projetos" }} />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
}