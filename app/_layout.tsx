import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

import { useColorScheme } from '@/presentation/theme/hooks/useColorScheme'
import { useThemeColor } from '@/presentation/theme/hooks/useThemeColor'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    KanitBold: require('../assets/fonts/Kanit-Bold.ttf'),
    KanitRegular: require('../assets/fonts/Kanit-Regular.ttf'),
    KanitThin: require('../assets/fonts/Kanit-Thin.ttf')
  })

  const backgroundColor = useThemeColor({}, 'background')

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ backgroundColor, flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false
            }}
          ></Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
