import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Mini Bio" }} />

      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          title: "Contato",
        }}
      />
    </Stack>
  );
}