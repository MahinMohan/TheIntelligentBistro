import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useMenu } from '../../src/hooks/useMenu';
import { useCart } from '../../src/hooks/useCart';
import { useCartStore } from '../../src/store/cartStore';
import { useOrderStore } from '../../src/store/orderStore';
import { CartItem } from '../../src/types';

interface CartRowProps {
  cartItem: CartItem;
  menuItem: { name: string; price: number; image: string } | undefined;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}

function CartRow({ cartItem, menuItem, onRemove, onQtyChange }: CartRowProps) {
  if (!menuItem) return null;
  const lineTotal = menuItem.price * cartItem.quantity;

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: 60 }}
      transition={{ type: 'spring', damping: 18 }}
      style={styles.cartRow}
    >
      <Image source={{ uri: menuItem.image }} style={styles.rowImage} />
      <View style={styles.rowBody}>
        <Text style={styles.rowName} numberOfLines={1}>{menuItem.name}</Text>
        <Text style={styles.rowPrice}>${menuItem.price} each</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onQtyChange(cartItem.quantity - 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.stepText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepQty}>{cartItem.quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => onQtyChange(cartItem.quantity + 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.stepText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.lineTotal}>${lineTotal.toFixed(2)}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.deleteBtn} activeOpacity={0.7}>
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

export default function CartScreen() {
  const { menu } = useMenu();
  const cart = useCart(menu);
  const cartItems = useCartStore((s) => s.items);
  const orderStore = useOrderStore();
  const previousOrders = useOrderStore((s) => s.orders);
  const router = useRouter();
  const [ordered, setOrdered] = useState(false);

  const handlePlaceOrder = useCallback(() => {
    // Save order snapshot before clearing
    const orderItems = cartItems.map((ci) => {
      const menuItem = menu.find((m) => m.id === ci.itemId);
      return {
        itemId: ci.itemId,
        name: menuItem?.name ?? ci.itemId,
        quantity: ci.quantity,
        price: menuItem?.price ?? 0,
      };
    });
    orderStore.placeOrder({
      items: orderItems,
      subtotal: cart.getSubtotal(),
      total: cart.getTotal(),
    });
    setOrdered(true);
    setTimeout(() => {
      cart.clearCart();
      setOrdered(false);
      Alert.alert('Order Placed! 🎉', 'Your order has been sent to the kitchen. Sit back and relax!');
    }, 2000);
  }, [cart, cartItems, menu, orderStore]);

  const subtotal = cart.getSubtotal();
  const tax = cart.getTax();
  const total = cart.getTotal();
  const itemCount = cart.getTotalItems();

  if (cartItems.length === 0) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.header}>
          <Text style={styles.headerTitle}>Your Order</Text>
          <TouchableOpacity
            style={[styles.prevOrdersBtn, previousOrders.length === 0 && styles.prevOrdersBtnDisabled]}
            onPress={() => previousOrders.length > 0 && router.push('/orders')}
            activeOpacity={previousOrders.length > 0 ? 0.7 : 1}
          >
            <Text style={[styles.prevOrdersBtnText, previousOrders.length === 0 && styles.prevOrdersBtnTextDisabled]}>
              Previous Orders {previousOrders.length > 0 ? `(${previousOrders.length})` : ''}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>Your table is set</Text>
          <Text style={styles.emptyDesc}>Add something delicious from the menu</Text>
          <View style={styles.emptyActions}>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>Browse Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.emptyBtn, styles.emptyBtnSecondary]}
              onPress={() => router.push('/(tabs)/chat')}
              activeOpacity={0.85}
            >
              <Text style={[styles.emptyBtnText, styles.emptyBtnTextSecondary]}>
                Ask the AI 💬
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Order</Text>
          <Text style={styles.headerSub}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.prevOrdersBtn, previousOrders.length === 0 && styles.prevOrdersBtnDisabled]}
          onPress={() => previousOrders.length > 0 && router.push('/orders')}
          activeOpacity={previousOrders.length > 0 ? 0.7 : 1}
        >
          <Text style={[styles.prevOrdersBtnText, previousOrders.length === 0 && styles.prevOrdersBtnTextDisabled]}>
            Previous Orders {previousOrders.length > 0 ? `(${previousOrders.length})` : ''}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item }) => {
          const menuItem = menu.find((m) => m.id === item.itemId);
          return (
            <CartRow
              cartItem={item}
              menuItem={menuItem}
              onRemove={() => cart.removeItem(item.itemId)}
              onQtyChange={(qty) => cart.updateQuantity(item.itemId, qty)}
            />
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Tax (8%)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>

            {ordered ? (
              <MotiView
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={styles.successBanner}
              >
                <Text style={styles.successText}>✓  Placing your order…</Text>
              </MotiView>
            ) : (
              <TouchableOpacity
                style={styles.placeOrderBtn}
                onPress={handlePlaceOrder}
                activeOpacity={0.85}
              >
                <Text style={styles.placeOrderText}>Place Order  →</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => cart.clearCart()}
              style={styles.clearBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.clearBtnText}>Clear cart</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Italic',
  },
  headerSub: { color: Colors.textMuted, fontSize: 13, fontFamily: 'DMSans-Regular', marginTop: 2 },
  prevOrdersBtn: {
    backgroundColor: Colors.gold + '22',
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  prevOrdersBtnDisabled: {
    backgroundColor: Colors.elevated,
    borderColor: Colors.border,
    opacity: 0.35,
  },
  prevOrdersBtnText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  prevOrdersBtnTextDisabled: {
    color: Colors.textMuted,
  },
  list: { padding: 16, paddingBottom: 40 },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginBottom: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowImage: { width: 64, height: 64, borderRadius: 10 },
  rowBody: { flex: 1, gap: 4 },
  rowName: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  rowPrice: { color: Colors.textMuted, fontSize: 12 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600', lineHeight: 18 },
  stepQty: { color: Colors.gold, fontSize: 14, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  rowRight: { alignItems: 'flex-end', gap: 10 },
  lineTotal: { color: Colors.gold, fontSize: 15, fontWeight: '700' },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 16 },

  // Summary
  summary: { marginTop: 8 },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: Colors.textMuted, fontSize: 14, fontFamily: 'DMSans-Regular' },
  summaryValue: { color: Colors.textPrimary, fontSize: 14, fontFamily: 'DMSans-Medium' },
  totalRow: { marginTop: 8, marginBottom: 20 },
  totalLabel: { color: Colors.textPrimary, fontSize: 20, fontFamily: 'PlayfairDisplay-Italic' },
  totalValue: { color: Colors.gold, fontSize: 26, fontWeight: '800' },

  placeOrderBtn: {
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
  placeOrderText: { color: Colors.black, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  successBanner: {
    backgroundColor: Colors.success + '22',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.success,
  },
  successText: { color: Colors.success, fontSize: 16, fontWeight: '700' },
  clearBtn: { alignItems: 'center', marginTop: 14, paddingVertical: 8 },
  clearBtnText: { color: Colors.textSubtle, fontSize: 13, textDecorationLine: 'underline' },

  // Empty state
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Italic',
  },
  emptyDesc: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
  },
  emptyActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  emptyBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnSecondary: { backgroundColor: Colors.elevated, borderWidth: 1, borderColor: Colors.border },
  emptyBtnText: { color: Colors.black, fontWeight: '700', fontSize: 14 },
  emptyBtnTextSecondary: { color: Colors.textPrimary },
});
