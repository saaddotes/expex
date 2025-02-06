import { Stack } from "expo-router";
import { DefaultTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
