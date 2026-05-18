import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated as RNAnimated,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Colors } from '../../src/constants/colors';
import { useMenu } from '../../src/hooks/useMenu';
import { useCart } from '../../src/hooks/useCart';
import { MenuCard } from '../../src/components/MenuCard';
import { CategoryTabs } from '../../src/components/CategoryTabs';
import { SkeletonCard } from '../../src/components/SkeletonCard';
import { FloatingCartButton } from '../../src/components/FloatingCartButton';
import { MenuCategory } from '../../src/types';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 60;

// ── Welcome Overlay ────────────────────────────────────────────────────────────
function WelcomeOverlay({ onDismiss }: { onDismiss: () => void }) {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    // Fade in
    RNAnimated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    // Auto-dismiss after 5 seconds
    const t = setTimeout(() => dismiss(), 5000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    RNAnimated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(
      () => onDismiss()
    );
  };

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      <RNAnimated.View style={[styles.overlayWrap, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />

        {/* Card */}
        <MotiView
          from={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 180 }}
          style={styles.welcomeCard}
        >
          {/* Logo */}
          <View style={styles.logoRing}>
            <Text style={styles.logoEmoji}>🤵</Text>
          </View>

          {/* Decorative line */}
          <View style={styles.decorRow}>
            <View style={styles.decorLine} />
            <Text style={styles.decorDot}>◆</Text>
            <View style={styles.decorLine} />
          </View>

          <Text style={styles.welcomeTitle}>Welcome to{'\n'}The Intelligent Bistro</Text>

          <Text style={styles.welcomeBody}>
            I am <Text style={styles.bold}>Sage</Text>, your AI dining assistant.{'\n\n'}
            Please feel free to browse our menu. When you're ready to order or need a recommendation, simply tap the{' '}
            <Text style={styles.bold}>Sage button</Text> — I'm always here.
          </Text>

          <View style={styles.decorRow}>
            <View style={styles.decorLine} />
            <Text style={styles.decorDot}>◆</Text>
            <View style={styles.decorLine} />
          </View>

          <TouchableOpacity style={styles.dismissBtn} onPress={dismiss} activeOpacity={0.8}>
            <Text style={styles.dismissText}>View Menu</Text>
          </TouchableOpacity>
        </MotiView>
      </RNAnimated.View>
    </Modal>
  );
}

// ── Floating AI Sommelier Button ───────────────────────────────────────────────
function SommelierButton() {
  const router = useRouter();
  return (
    <MotiView
      from={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 14, delay: 200 }}
      style={styles.sommelierWrap}
    >
      <TouchableOpacity
        style={styles.sommelierBtn}
        onPress={() => router.push('/(tabs)/chat')}
        activeOpacity={0.85}
      >
        <Text style={styles.sommelierEmoji}>🤵</Text>
      </TouchableOpacity>
      <View style={styles.sommelierLabelWrap}>
        <Text style={styles.sommelierLabel}>SAGE</Text>
      </View>
    </MotiView>
  );
}

// ── Menu Screen ────────────────────────────────────────────────────────────────
export default function MenuScreen() {
  const { menu, loading } = useMenu();
  const cart = useCart(menu);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [showWelcome, setShowWelcome] = useState(true);
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [26, 18],
    extrapolate: 'clamp',
  });

  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const filteredMenu =
    activeCategory === 'All'
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  const pairs: Array<typeof menu> = [];
  for (let i = 0; i < filteredMenu.length; i += 2) {
    pairs.push(filteredMenu.slice(i, i + 2));
  }

  const subtotal = cart.getSubtotal();

  const renderRow = useCallback(
    ({ item: pair }: { item: typeof menu }) => (
      <View style={styles.row}>
        {pair.map((menuItem) => (
          <MenuCard
            key={menuItem.id}
            item={menuItem}
            quantity={cart.getItemQuantity(menuItem.id)}
            onAdd={() => cart.addItem(menuItem.id)}
            onUpdateQty={(qty) => cart.updateQuantity(menuItem.id, qty)}
          />
        ))}
        {pair.length === 1 && <View style={styles.emptyCell} />}
      </View>
    ),
    [cart]
  );

  const skeletonPairs = Array.from({ length: 6 }).map((_, i) => [i * 2, i * 2 + 1]);

  return (
    <View style={styles.screen}>
      {/* Welcome overlay — shown once on mount */}
      {showWelcome && <WelcomeOverlay onDismiss={() => setShowWelcome(false)} />}

      {/* Animated Header */}
      <RNAnimated.View style={[styles.header, { height: headerHeight }]}>
        <SafeAreaView>
          <RNAnimated.Text style={[styles.title, { fontSize: titleSize }]}>
            The Intelligent Bistro
          </RNAnimated.Text>
          <RNAnimated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
            Fine dining, intelligently ordered
          </RNAnimated.Text>
        </SafeAreaView>
      </RNAnimated.View>

      {/* Category Tabs */}
      <View style={styles.tabsWrapper}>
        <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
      </View>

      {/* Menu Grid */}
      {loading ? (
        <FlatList
          data={skeletonPairs}
          keyExtractor={(_, i) => `skel-${i}`}
          renderItem={() => (
            <View style={styles.row}>
              <SkeletonCard />
              <SkeletonCard />
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : filteredMenu.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>No dishes here</Text>
          <Text style={styles.emptyDesc}>Try a different category</Text>
        </View>
      ) : (
        <RNAnimated.FlatList
          data={pairs}
          keyExtractor={(_, i) => `row-${i}`}
          renderItem={renderRow}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={RNAnimated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}

      {/* Floating Sommelier button — bottom left */}
      {!showWelcome && <SommelierButton />}

      {/* Floating Cart — bottom right */}
      <FloatingCartButton itemCount={cart.getTotalItems()} subtotal={subtotal} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },

  // ── Welcome overlay ──
  overlayWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 28,
  },
  welcomeCard: {
    width: '100%',
    backgroundColor: 'rgba(20,20,22,0.72)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(232,168,56,0.35)',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: 'rgba(232,168,56,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoEmoji: { fontSize: 32 },
  decorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  decorLine: { flex: 1, height: 1, backgroundColor: 'rgba(232,168,56,0.3)' },
  decorDot: { color: Colors.gold, fontSize: 8, opacity: 0.7 },
  welcomeTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'PlayfairDisplay-BoldItalic',
  },
  welcomeBody: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'DMSans-Regular',
  },
  bold: { color: Colors.gold, fontWeight: '700' },
  dismissBtn: {
    marginTop: 4,
    backgroundColor: Colors.gold,
    paddingHorizontal: 36,
    paddingVertical: 13,
    borderRadius: 14,
  },
  dismissText: { color: Colors.black, fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },

  // ── Sommelier FAB ──
  sommelierWrap: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    alignItems: 'center',
    gap: 4,
    zIndex: 100,
  },
  sommelierBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.gold,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 12,
  },
  sommelierEmoji: { fontSize: 24 },
  sommelierLabelWrap: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  sommelierLabel: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },

  // ── Header ──
  header: {
    backgroundColor: Colors.bg,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 8,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { color: Colors.gold, fontFamily: 'PlayfairDisplay-BoldItalic', letterSpacing: 0.5 },
  subtitle: { color: Colors.textMuted, fontSize: 13, fontFamily: 'DMSans-Regular', marginTop: 2 },
  tabsWrapper: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  list: { padding: 10, paddingBottom: 120 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  emptyCell: { width: (width - 48) / 2, margin: 6 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { color: Colors.textPrimary, fontSize: 20, fontFamily: 'PlayfairDisplay-Italic' },
  emptyDesc: { color: Colors.textMuted, fontSize: 14, fontFamily: 'DMSans-Regular' },
});
