import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Colors } from '../src/constants/colors';
import { useOrderStore, PlacedOrder } from '../src/store/orderStore';

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

function OrderCard({ order, index }: { order: PlacedOrder; index: number }) {
  const [elapsed, setElapsed] = useState(timeAgo(order.placedAt));

  // Refresh elapsed time every 30 seconds
  useEffect(() => {
    const t = setInterval(() => setElapsed(timeAgo(order.placedAt)), 30000);
    return () => clearInterval(t);
  }, [order.placedAt]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, delay: index * 80 }}
      style={styles.card}
    >
      {/* Order header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderTime}>{elapsed}</Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>In Kitchen</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Items */}
      {order.items.map((item, i) => (
        <View key={i} style={styles.itemRow}>
          <Text style={styles.itemQty}>{item.quantity}×</Text>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      {/* Totals */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Subtotal</Text>
        <Text style={styles.totalValue}>${order.subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tax (8%)</Text>
        <Text style={styles.totalValue}>${(order.total - order.subtotal).toFixed(2)}</Text>
      </View>
      <View style={[styles.totalRow, styles.grandRow]}>
        <Text style={styles.grandLabel}>Order Total</Text>
        <Text style={styles.grandValue}>${order.total.toFixed(2)}</Text>
      </View>
    </MotiView>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const orders = useOrderStore((s) => s.orders);

  const sessionTotal = orders.reduce((s, o) => s + o.total, 0);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Order History</Text>
          <Text style={styles.headerSub}>{orders.length} {orders.length === 1 ? 'order' : 'orders'} this session</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {orders.slice().reverse().map((order, i) => (
          <OrderCard key={order.id} order={order} index={i} />
        ))}

        {/* Session total */}
        {orders.length > 1 && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: orders.length * 80 + 100 }}
            style={styles.sessionCard}
          >
            <Text style={styles.sessionLabel}>Session Grand Total</Text>
            <Text style={styles.sessionValue}>${sessionTotal.toFixed(2)}</Text>
            <Text style={styles.sessionSub}>across {orders.length} orders</Text>
          </MotiView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 54,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backArrow: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Italic',
  },
  headerSub: { color: Colors.textMuted, fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 1 },

  list: { padding: 16, paddingBottom: 40, gap: 14 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: { color: Colors.gold, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  orderTime: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  statusPill: {
    backgroundColor: '#1A3320',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { color: '#3DAA6E', fontSize: 11, fontWeight: '700' },

  divider: { height: 1, backgroundColor: Colors.border },

  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemQty: { color: Colors.gold, fontSize: 13, fontWeight: '700', minWidth: 24 },
  itemName: { color: Colors.textPrimary, fontSize: 13, flex: 1 },
  itemPrice: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { color: Colors.textMuted, fontSize: 13 },
  totalValue: { color: Colors.textPrimary, fontSize: 13 },
  grandRow: { marginTop: 4 },
  grandLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  grandValue: { color: Colors.gold, fontSize: 18, fontWeight: '800' },

  // Session total card
  sessionCard: {
    backgroundColor: Colors.elevated,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold + '44',
    gap: 4,
  },
  sessionLabel: { color: Colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  sessionValue: { color: Colors.gold, fontSize: 32, fontWeight: '800' },
  sessionSub: { color: Colors.textMuted, fontSize: 12 },
});
