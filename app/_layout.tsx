import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useAppTheme } from '../src/theme';
import { ListProvider } from '../src/store';

function RootNavigator() {
  const { colors, isDark } = useAppTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="list/[id]" />
        <Stack.Screen
          name="create-list"
          options={{ presentation: 'card', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="edit-list/[id]"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ListProvider>
        <RootNavigator />
      </ListProvider>
    </ThemeProvider>
  );
}