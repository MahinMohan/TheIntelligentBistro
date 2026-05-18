import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';

interface Props {
  itemCount: number;
  subtotal: number;
}

export function FloatingCartButton({ itemCount, subtotal }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (itemCount > 0) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 6 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [itemCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const router = useRouter();

  if (itemCount === 0) return null;

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/cart')}
        activeOpacity={0.85}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount}</Text>
        </View>
        <Text style={styles.icon}>🛒</Text>
        <Text style={styles.subtotal}>${subtotal.toFixed(2)}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 100,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: Colors.gold, fontSize: 11, fontWeight: '800' },
  icon: { fontSize: 16 },
  subtotal: { color: Colors.black, fontSize: 14, fontWeight: '700' },
});
