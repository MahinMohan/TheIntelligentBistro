import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Colors } from '../../src/constants/colors';
import { menuItems } from '../../src/data/menu';
import { useCart } from '../../src/hooks/useCart';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.75;

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
      <Text style={styles.spiceLabel}>Spice</Text>
      {Array.from({ length: 3 }).map((_, i) => (
        <View
          key={i}
          style={[styles.spiceDot, { backgroundColor: i < level ? Colors.red : Colors.border }]}
        />
      ))}
    </View>
  );
}

function CartToast({ visible }: { visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);
  return (
    <Animated.View style={[toastStyles.toast, { opacity }]}>
      <Text style={toastStyles.text}>🛒  Added to cart</Text>
    </Animated.View>
  );
}

const toastStyles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: Colors.elevated,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.gold,
    zIndex: 999,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: { color: Colors.gold, fontWeight: '700', fontSize: 14 },
});

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const cart = useCart(menuItems);
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1800);
  };

  const item = menuItems.find((m) => m.id === id);

  if (!item) {
    return (
      <View style={styles.screen}>
        <SafeAreaView>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Dish not found</Text>
        </View>
      </View>
    );
  }

  const quantity = cart.getItemQuantity(item.id);

  return (
    <View style={styles.screen}>
      <CartToast visible={toastVisible} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {/* Back button over image */}
          <SafeAreaView style={styles.backOverlay}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </SafeAreaView>
          {/* Category pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        {/* Content */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          style={styles.content}
        >
          {/* Name + Price row */}
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {item.tags.map((tag) => {
              const colors = TAG_COLORS[tag] ?? { bg: Colors.elevated, text: Colors.textMuted };
              return (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.bg }]}>
                  <Text style={[styles.tagText, { color: colors.text }]}>
                    {tag === 'gluten-free' ? 'Gluten-Free' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </Text>
                </View>
              );
            })}
          </View>

          <SpiceDots level={item.spiceLevel} />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>About this dish</Text>
          <Text style={styles.description}>{item.description}</Text>
        </MotiView>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <View style={styles.bottomBar}>
        {quantity === 0 ? (
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => { cart.addItem(item.id); showToast(); }}
            activeOpacity={0.85}
          >
            <Text style={styles.addToCartText}>Add to Cart  +</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepperBar}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => cart.updateQuantity(item.id, quantity - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <View style={styles.qtyBox}>
              <Text style={styles.qtyText}>{quantity} in cart</Text>
            </View>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => cart.updateQuantity(item.id, quantity + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },

  // Image
  imageContainer: { width, height: IMAGE_HEIGHT, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  backOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  backText: { color: Colors.gold, fontSize: 16, fontWeight: '600' },
  categoryPill: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryText: { color: Colors.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },

  // Content
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  name: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800', flex: 1, marginRight: 12 },
  price: { color: Colors.gold, fontSize: 26, fontWeight: '800' },

  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  spiceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  spiceLabel: { color: Colors.textMuted, fontSize: 12 },
  spiceDot: { width: 8, height: 8, borderRadius: 4 },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 16 },

  sectionLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  description: { color: Colors.textPrimary, fontSize: 15, lineHeight: 24 },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: Colors.textMuted, fontSize: 16 },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addToCartBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  addToCartText: { color: Colors.black, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  stepperBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtnText: { color: Colors.textPrimary, fontSize: 22, fontWeight: '600' },
  qtyBox: {
    backgroundColor: Colors.elevated,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  qtyText: { color: Colors.gold, fontSize: 15, fontWeight: '700' },
});
