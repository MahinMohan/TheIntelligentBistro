import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { MenuCategory } from '../types';

const CATEGORIES: { label: MenuCategory; emoji: string }[] = [
  { label: 'All', emoji: '🍽️' },
  { label: 'Starters', emoji: '🥗' },
  { label: 'Mains', emoji: '🥩' },
  { label: 'Desserts', emoji: '🍮' },
  { label: 'Drinks', emoji: '🍸' },
];

interface Props {
  active: MenuCategory;
  onSelect: (cat: MenuCategory) => void;
}

export function CategoryTabs({ active, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.label;
        return (
          <TouchableOpacity
            key={cat.label}
            onPress={() => onSelect(cat.label)}
            activeOpacity={0.8}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={styles.emoji}>{cat.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  emoji: { fontSize: 14 },
  label: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  labelActive: { color: Colors.black, fontWeight: '700' },
});
