import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function RootLayoutNav() {
  const { modoEscuro } = useTheme();

  return (
    <>
      <StatusBar style={modoEscuro ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="redefinir-senha" />
        <Stack.Screen name="termos" options={{ presentation: 'modal' }} />
        <Stack.Screen name="ocorrencias/[id]" />
        <Stack.Screen name="ocorrencias/novaOcorrencia" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}