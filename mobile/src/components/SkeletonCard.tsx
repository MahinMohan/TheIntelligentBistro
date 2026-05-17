import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.image} />
      <View style={styles.body}>
        <View style={styles.title} />
        <View style={styles.desc} />
        <View style={styles.descShort} />
        <View style={styles.price} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    margin: 6,
  },
  image: { width: '100%', height: 140, backgroundColor: Colors.elevated },
  body: { padding: 12, gap: 6 },
  title: { height: 14, borderRadius: 7, backgroundColor: Colors.elevated, width: '80%' },
  desc: { height: 10, borderRadius: 5, backgroundColor: Colors.elevated, width: '100%' },
  descShort: { height: 10, borderRadius: 5, backgroundColor: Colors.elevated, width: '60%' },
  price: { height: 14, borderRadius: 7, backgroundColor: Colors.elevated, width: '35%', marginTop: 4 },
});
