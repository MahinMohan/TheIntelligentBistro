import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { MenuItem } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface Props {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onUpdateQty: (qty: number) => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  vegetarian: { bg: '#1A3320', text: '#3DAA6E' },
  'gluten-free': { bg: '#1A2533', text: '#4A90D9' },
  spicy: { bg: '#2E1510', text: '#C94B3A' },
  popular: { bg: '#2A1F0A', text: '#E8A838' },
  bestseller: { bg: '#2A1F0A', text: '#F0BC5E' },
};

function SpiceDots({ level }: { level: number }) {
  if (level === 0) return null;
  return (
    <View style={styles.spiceRow}>
      {Array.from({ length: 3 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.spiceDot,
            { backgroundColor: i < level ? Colors.red : Colors.border },
          ]}
        />
      ))}
    </View>
  );
}

export function MenuCard({ item, quantity, onAdd, onUpdateQty }: Props) {
  const router = useRouter();
  const btnScale = useSharedValue(1);
  const badgeScale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const handleAdd = useCallback(() => {
    btnScale.value = withSequence(
      withSpring(0.85, { damping: 10 }),
      withSpring(1, { damping: 8 })
    );
    badgeScale.value = withSequence(
      withSpring(1.4, { damping: 8 }),
      withSpring(1, { damping: 10 })
    );
    onAdd();
  }, [btnScale, badgeScale, onAdd]);

  const visibleTags = item.tags.slice(0, 2);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/dish/${item.id}`)}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {quantity > 0 && (
          <Animated.View style={[styles.qtyBadge, badgeStyle]}>
            <Text style={styles.qtyBadgeText}>{quantity}</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

        <View style={styles.tagsRow}>
          {visibleTags.map((tag) => {
            const colors = TAG_COLORS[tag] ?? { bg: Colors.elevated, text: Colors.textMuted };
            return (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.bg }]}>
                <Text style={[styles.tagText, { color: colors.text }]}>
                  {tag === 'gluten-free' ? 'GF' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${item.price}</Text>
            <SpiceDots level={item.spiceLevel} />
          </View>

          {quantity === 0 ? (
            <Animated.View style={btnStyle}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={(e) => { e.stopPropagation(); handleAdd(); }}
                activeOpacity={0.8}
              >
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={(e) => { e.stopPropagation(); onUpdateQty(quantity - 1); }}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Animated.Text style={[styles.stepQty, badgeStyle]}>{quantity}</Animated.Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={(e) => { e.stopPropagation(); onUpdateQty(quantity + 1); }}
                activeOpacity={0.7}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    margin: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageWrapper: { position: 'relative', width: '100%', height: 140 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  qtyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBadgeText: { color: Colors.black, fontSize: 12, fontWeight: '700' },
  body: { padding: 10, gap: 4 },
  name: { color: Colors.textPrimary, fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  desc: { color: Colors.textMuted, fontSize: 11, lineHeight: 15 },
  tagsRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginTop: 2 },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  price: { color: Colors.gold, fontSize: 15, fontWeight: '700' },
  spiceRow: { flexDirection: 'row', gap: 3, marginTop: 3 },
  spiceDot: { width: 5, height: 5, borderRadius: 3 },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: Colors.black, fontSize: 18, fontWeight: '700', lineHeight: 20 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtnText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600', lineHeight: 16 },
  stepQty: { color: Colors.gold, fontSize: 13, fontWeight: '700', minWidth: 16, textAlign: 'center' },
});
