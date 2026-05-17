import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '../constants/colors';

const SUGGESTIONS = [
  "What's popular tonight? 🔥",
  'Add 2 spicy chicken sandwiches 🌶️',
  "I'd like something vegetarian 🌿",
  'What desserts do you have? 🍮',
  'Show me my cart 🛒',
];

interface Props {
  onSelect: (text: string) => void;
}

export function SuggestionChips({ onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {SUGGESTIONS.map((s, i) => (
        <MotiView
          key={s}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: i * 80, damping: 18 }}
        >
          <TouchableOpacity
            style={styles.chip}
            onPress={() => onSelect(s)}
            activeOpacity={0.75}
          >
            <Text style={styles.chipText}>{s}</Text>
          </TouchableOpacity>
        </MotiView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: { color: Colors.textPrimary, fontSize: 13 },
});
