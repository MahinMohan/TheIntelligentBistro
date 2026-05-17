import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '../constants/colors';

export function TypingIndicator() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bubble}>
        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            style={styles.dot}
            from={{ opacity: 0.3, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'timing',
              duration: 500,
              loop: true,
              delay: i * 160,
              repeatReverse: true,
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'flex-start', marginVertical: 4, paddingHorizontal: 16 },
  bubble: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: Colors.elevated,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
});
