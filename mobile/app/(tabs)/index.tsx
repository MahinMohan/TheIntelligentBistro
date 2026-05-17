import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated as RNAnimated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
} from 'react-native';
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

export default function MenuScreen() {
  const { menu, loading } = useMenu();
  const cart = useCart(menu);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const scrollY = React.useRef(new RNAnimated.Value(0)).current;

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

  // Pair items for 2-column grid
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

      {/* Floating Cart */}
      <FloatingCartButton
        itemCount={cart.getTotalItems()}
        subtotal={subtotal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: {
    backgroundColor: Colors.bg,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 8,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    color: Colors.gold,
    fontFamily: 'PlayfairDisplay-BoldItalic',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    fontFamily: 'DMSans-Regular',
    marginTop: 2,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  list: { padding: 10, paddingBottom: 120 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  emptyCell: { width: (width - 48) / 2, margin: 6 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { color: Colors.textPrimary, fontSize: 20, fontFamily: 'PlayfairDisplay-Italic' },
  emptyDesc: { color: Colors.textMuted, fontSize: 14, fontFamily: 'DMSans-Regular' },
});
