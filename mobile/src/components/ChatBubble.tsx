import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '../constants/colors';
import { ChatMessage, AIActionType, MenuItem } from '../types';

interface ActionCardProps {
  actions: AIActionType[];
  menu: MenuItem[];
  onUndo: () => void;
}

function ActionCard({ actions, menu, onUndo }: ActionCardProps) {
  const realActions = actions.filter((a) => a.type !== 'NONE');

  return (
    <View style={styles.actionCard}>
      <View style={styles.actionHeader}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.actionTitle}>Cart Updated</Text>
        <TouchableOpacity onPress={onUndo} style={styles.undoBtn} activeOpacity={0.7}>
          <Text style={styles.undoText}>Undo</Text>
        </TouchableOpacity>
      </View>
      {realActions.map((action, idx) => {
        if (action.type === 'ADD_ITEM' || action.type === 'UPDATE_QUANTITY') {
          const item = menu.find((m) => m.id === action.itemId);
          if (!item) return null;
          const qty = action.quantity;
          const subtotal = item.price * qty;
          return (
            <View key={idx} style={styles.actionRow}>
              <Text style={styles.actionQty}>{qty}×</Text>
              <Text style={styles.actionName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.actionPrice}>${subtotal.toFixed(2)}</Text>
            </View>
          );
        }
        if (action.type === 'REMOVE_ITEM') {
          const item = menu.find((m) => m.id === action.itemId);
          return (
            <View key={idx} style={styles.actionRow}>
              <Text style={styles.actionRemove}>Removed  </Text>
              <Text style={styles.actionName}>{item?.name ?? action.itemId}</Text>
            </View>
          );
        }
        if (action.type === 'CLEAR_CART') {
          return (
            <View key={idx} style={styles.actionRow}>
              <Text style={styles.actionRemove}>Cart cleared</Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}

interface BubbleProps {
  message: ChatMessage;
  menu: MenuItem[];
  onUndo: () => void;
}

export function ChatBubble({ message, menu, onUndo }: BubbleProps) {
  const isUser = message.role === 'user';

  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      style={[styles.container, isUser ? styles.containerUser : styles.containerAI]}
    >
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
          {message.content}
        </Text>
      </View>

      {message.isActionCard && message.actions && (
        <ActionCard actions={message.actions} menu={menu} onUndo={onUndo} />
      )}

      <Text style={[styles.timestamp, isUser ? styles.tsRight : styles.tsLeft]}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 4, paddingHorizontal: 16, maxWidth: '85%' },
  containerUser: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  containerAI: { alignSelf: 'flex-start', alignItems: 'flex-start' },

  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '100%',
  },
  bubbleUser: {
    backgroundColor: Colors.gold,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.elevated,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: { fontSize: 14, lineHeight: 20 },
  textUser: { color: Colors.black, fontWeight: '500' },
  textAI: { color: Colors.textPrimary },

  timestamp: { fontSize: 10, color: Colors.textSubtle, marginTop: 3 },
  tsRight: { textAlign: 'right' },
  tsLeft: { textAlign: 'left' },

  actionCard: {
    marginTop: 6,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.success + '55',
    minWidth: 220,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  checkmark: { color: Colors.success, fontSize: 14, fontWeight: '700' },
  actionTitle: { color: Colors.success, fontSize: 13, fontWeight: '700', flex: 1 },
  undoBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  undoText: { color: Colors.textMuted, fontSize: 11 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  actionQty: { color: Colors.gold, fontSize: 12, fontWeight: '700', minWidth: 22 },
  actionName: { color: Colors.textPrimary, fontSize: 12, flex: 1 },
  actionPrice: { color: Colors.gold, fontSize: 12, fontWeight: '600' },
  actionRemove: { color: Colors.red, fontSize: 12, fontWeight: '600' },
});
