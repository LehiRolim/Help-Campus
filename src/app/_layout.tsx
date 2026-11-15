import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="perfil" options={{ headerShown: true, title: 'Perfil' }} />
        <Stack.Screen name="recuperar-senha" options={{ headerShown: true, title: 'Recuperar senha' }} />
        <Stack.Screen name="termos-privacidade" options={{ headerShown: true, title: 'Termos e privacidade' }} />
      </Stack>
    </>
  );
}
