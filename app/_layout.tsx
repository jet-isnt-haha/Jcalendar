//* 根布局 （全局配置）
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
