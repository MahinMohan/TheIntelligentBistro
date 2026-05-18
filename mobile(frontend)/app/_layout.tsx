import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

const RESTAURANT_BG = require('../assets/splash-bg.png');

function CustomSplash({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const screenFade = new Animated.Value(1);

  useEffect(() => {
    // Fade in logo
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    // After 2.5s fade out the whole splash
    const timer = setTimeout(() => {
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: screenFade }]}>
      <ImageBackground
        source={RESTAURANT_BG}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Subtle overlay — keep image bright */}
        <View style={styles.overlay} />

      </ImageBackground>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const [loaded] = useFonts({
    'PlayfairDisplay-Italic': require('../assets/fonts/PlayfairDisplay-Italic.ttf'),
    'PlayfairDisplay-BoldItalic': require('../assets/fonts/PlayfairDisplay-BoldItalic.ttf'),
    'DMSans-Regular': require('../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-Bold': require('../assets/fonts/DMSans-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  if (showSplash) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" />
        <CustomSplash onFinish={() => setShowSplash(false)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" backgroundColor="#0A0A0B" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0B' },

  splashContainer: { flex: 1 },

  bg: { flex: 1, width, height, justifyContent: 'center', alignItems: 'center' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0)',
  },

  logoWrap: {
    alignItems: 'center',
    gap: 10,
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(232,168,56,0.15)',
    borderWidth: 2,
    borderColor: '#E8A838',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconEmoji: { fontSize: 40 },

  splashTitle: {
    color: '#E8A838',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  splashSub: {
    color: '#F5F0E8',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.85,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  dividerLine: { width: 60, height: 1, backgroundColor: '#E8A838', opacity: 0.5 },
  dividerDot: { color: '#E8A838', fontSize: 8, opacity: 0.7 },
});
